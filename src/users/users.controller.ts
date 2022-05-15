import {Body,Controller,Delete,Get,Post,UsePipes,ValidationPipe,} from '@nestjs/common';
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import { CreateAccountInput, CreateAccountOutput } from 'src/users/dtos/createUser.dto';
import { EditProfileInput, EditProfileOutput } from 'src/users/dtos/updateUser.dto';
import { LoginInput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verifyEmail.dto';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {};

  
  @Post()
  async createBoard(@Body() createAccountInput: CreateAccountInput):Promise<CreateAccountOutput>{ 
    console.log('createBoard 포스트 진입 성공');
    console.log(createAccountInput);
    return await this.usersService.createBoard(createAccountInput);
  }

  
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginInput: LoginInput) {
    console.log("바디의 로그인 JSON : ", loginInput)
    console.log('로그인 포스트 진입');
    try {
      const loginData = await this.usersService.login(loginInput)
      console.log("로그인포스트 리턴 : ",loginData)
      return loginData;
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }


  @Get('token')
  @Role(["Any"])
  async me(@AuthUser() authUser:UserEntity) {
    console.log("GET 토큰 진입")
    const result = await authUser;
    console.log("사용자 정보 id : ", result.id)
    console.log("사용자 정보 출력 완료")
    return result;
  }

  @Post('userProfile')
  @Role(["Any"])
  async userProfile(@Body() userProfileInput:UserProfileInput): Promise<UserProfileOutput> {
    console.log("userProfile 포스트 접근 성공 ")
    console.log("userProfileInput : ",userProfileInput)
    return this.usersService.findById(userProfileInput.userId)
  }

  @Post("edit")
  @Role(["Any"])
  async editProfile(
    @AuthUser() authUser:UserEntity,
    @Body() editProfileInput: EditProfileInput 
  ):Promise<EditProfileOutput> {
    console.log("유저 에디트 포스트 진입")
    try{
      console.log("에디트 인풋 값 : ",editProfileInput)
      // @ts-ignore
      console.log("어스 유저 값 : ",authUser) //문제 없음
      await this.usersService.editProfile(authUser.id, editProfileInput); 
      return{
        ok:true,
      }
    }catch(error){
      return{
        ok:false,
        error
      }
    }
  }

  @Post("email")
  async verifyEmail(@Body() verifyEmailInput: VerifyEmailInput):Promise<VerifyEmailOutput>{
      const {ok, error}=await this.usersService.verifyEmail(verifyEmailInput.code)
      return{ok, error}
  }

  @Get("loginUser")
  async getUser(@AuthUser() authUser:UserEntity) {
    const result = await this.usersService.findById(authUser.id);
    return result;
  }


  @Get("All")
  async getAllUser() {
    const result = await this.usersService.getUser();
    return result;
  }

  @Delete() //user지우면 varification도 지워짐
  async removeOne(@AuthUser() authUser:UserEntity) {
    const ret = await this.usersService.removeOneUser(authUser.id);
    return ret;
  }


}
