import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountInput, CreateAccountOutput } from 'src/users/dtos/createUser.dto';
import { UserEntity } from 'src/users/entities/users.entity';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/updateUser.dto';
import { UserRepository } from './users.repository';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';
import { VerifyEmailOutput } from './dtos/verifyEmail.dto';
import { UserProfileOutput } from './dtos/userProfile.dto';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: UserRepository,
    @InjectRepository(Verification) private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService, //메일 보내는 서비스 파일
  ) {}
  async getUser() {
    const result = await this.userRepository.find({
      select: ['id', 'email', 'password', 'role','cafes'],relations:["cafes"]
    });
    console.log(result)
    return result
  }

  async createBoard({ email, password, role } : CreateAccountInput): Promise<CreateAccountOutput> { //createUserDto
    try {
      const foundedEmail = await this.userRepository.findOne({where: { email: email },});
      if (foundedEmail) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.userRepository.save(this.userRepository.create({ email, password, role } ));//createUserDto
      const verification = await this.verification.save(this.verification.create({user: user}));
      this.mailService.sendVerificationEmail(user.email, verification.code) 
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },select:['id','password']
      });
      //console.log("사용자 확인 : ",user)
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't log user in.",
      };
    }
  }

  //헤더에 담긴 계정 토큰으로 계정 파악 후 수정
  async editProfile(userId:number,{email,password}:EditProfileInput):Promise<EditProfileOutput>{//number
    try {
      const user = await this.userRepository.findOne({where:{id:userId}})
      if(email){
        user.email=email
        user.verified = false;
        await this.verification.delete({ user: { id: user.id } })
        const verification = await this.verification.save(this.verification.create({user: user})) 
        this.mailService.sendVerificationEmail(user.email, verification.code)
      }
      if(password){
        user.password=password
      }
      await this.userRepository.save(user)
      return {
        ok:true,
      }
    } catch (error) {
      return {ok: false, error: 'Could not update profile.'};
    }
  }


  async removeOneUser(id: number) : Promise<UserProfileOutput>{
      const user=await this.userRepository.findOne({where:{id:id}})
      if(user){
        await this.userRepository.delete(id);
        return {
          ok:true,
          user:user,
        }
      }
      else{
        return {ok:false, error:'User Not Found'}
      }
  }

  async findById(id: number): Promise<UserProfileOutput> { 
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id: id }, relations:['cafes'] });
        return{
          ok:true,
          user:user,
        }
    } catch (error) {
      return {ok:false, error:'User Not Found'}
    }

  }

  async verifyEmail(code:string):Promise<VerifyEmailOutput>{
    try {
      const verification = await this.verification.findOne({where:{code:code},relations:["user"]});
      //loadRelationIds:true id만 가져오고 싶다면!
      if(verification){
        verification.user.verified = true
        await this.userRepository.save(verification.user) 
        await this.verification.delete(verification.id)
        return {ok:true}
      }
      return {ok:false, error:"Verification not found"}
    } catch (error) {
      return {ok:false, error:"Could not verify email"}
    }

  }
}
