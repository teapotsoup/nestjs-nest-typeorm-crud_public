import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./entities/users.entity";
import { Verification } from "./entities/verification.entity";
import { UsersService } from "./users.service";
import { JwtService } from "../jwt/jwt.service"
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";

const mockRepository =()=>({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findOneOrFail:jest.fn(),
});

const mockJwtService = {
    sign: jest.fn(()=>'signed-token-baby'),
    verify: jest.fn(),
}

const mockMailService={
    sendVerificationEmail: jest.fn(),
}

type MockRepository<T=any> =  Partial<Record<keyof Repository<T>,jest.Mock>>;

describe("UsersService",()=>{
    let service: UsersService;
    let usersRepository:MockRepository<UserEntity>;
    let verificationsRepository: MockRepository<Verification>;
    let mailService: MailService;
    let jwtService: JwtService;

    beforeEach(async()=>{
        const modules =await Test.createTestingModule({
            providers: [UsersService,{
                provide: getRepositoryToken(UserEntity),
                useValue: mockRepository()
            },
            {
                provide: getRepositoryToken(Verification),
                useValue: mockRepository()
            },
            {
                provide: JwtService,
                useValue: mockJwtService
            },
            {
                provide: MailService,
                useValue: mockMailService
            },]
        }).compile()
        service = modules.get<UsersService>(UsersService);
        mailService = modules.get<MailService>(MailService);
        jwtService = modules.get<JwtService>(JwtService)
        usersRepository = modules.get(getRepositoryToken(UserEntity))
        verificationsRepository = modules.get(getRepositoryToken(Verification));
    })

    it('should be defiend', ()=>{
        expect(service).toBeDefined();
    })

    describe("createBoard", ()=>{
        const createAccountArgs={
            email:'',
            password:'',
            status:''
        }
        it("should fail if user exists",async ()=>{
            usersRepository.findOne.mockResolvedValue({
                id:1,
                email:"salma",
            })
            const result = await service.createBoard(createAccountArgs)
            expect(result).toMatchObject({
                ok: false, error: 'There is a user with that email already'
            })
        })
        it('should create a new user', async()=>{
            usersRepository.findOne.mockResolvedValue(undefined);
            usersRepository.create.mockReturnValue(createAccountArgs);
            usersRepository.save.mockResolvedValue(createAccountArgs);
            verificationsRepository.create.mockReturnValue({
                user:createAccountArgs,
            })
            //verificationsRepository.save.mockResolvedValue(createAccountArgs)
            verificationsRepository.save.mockResolvedValue({
              code: 'code',
            });
      
            const result = await service.createBoard(createAccountArgs);
      
            expect(usersRepository.create).toHaveBeenCalledTimes(1);
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
      
            expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
            expect(verificationsRepository.create).toHaveBeenCalledWith({
              user: createAccountArgs,
            });
            
            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1)
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
            )
            expect(result).toEqual({ok:true})
        })
        it('should fail on exception', async () => {
            usersRepository.findOne.mockRejectedValue(new Error());
            const result = await service.createBoard(createAccountArgs);
            expect(result).toEqual({ ok: false, error: "Couldn't create account" });
          });

    })
    describe('login',()=>{
        const loginArgs ={
            email:'test@naver.com',
            password:'test'
        }
        it('should fail if user does not exist', async()=>{
            usersRepository.findOne.mockResolvedValue(null)
            const result = await service.login(loginArgs)
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
              );
            expect(result).toEqual({
                ok:false,
                error:'User not found'
            })
        })
        it('should fail if the password is wrong', async()=>{
            const mockedUser = {
                id:1,
                checkPassword: jest.fn(()=>Promise.resolve(false))
            }
            usersRepository.findOne.mockResolvedValue(mockedUser)
            const result = await service.login(loginArgs)
            expect(result).toEqual({ ok: false, error: 'Wrong password' })
        })
        it('should return token if password correct',async () => {
            const mockedUser = {
                id:1,
                checkPassword: jest.fn(()=>Promise.resolve(true))
            }
            usersRepository.findOne.mockResolvedValue(mockedUser)
            const result = await service.login(loginArgs)
            expect(jwtService.sign).toHaveBeenCalledTimes(1)
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
            expect(result).toEqual({ok:true, token:'signed-token-baby'})

        })
        it('should fail on exception',async () => {
            usersRepository.findOne.mockRejectedValue(new Error())
            const result = await service.login(loginArgs) 
            expect(result).toEqual({ ok: false, error: "Can't log user in." })
        })
    });
    describe('getAllUsers',()=>{
        it("getAllUsers",async () => {
            const result = await usersRepository.find({
                select: ['id', 'email', 'password', 'status'],
              });
        })
    });
    describe('removeOneUser',()=>{
        const userData = {
            id:1,
            email:"bs@naver.com",
            password:"fake",
            status:"PUBLIC"
        }
        it('should find an existing user',async()=>{
            usersRepository.findOne.mockResolvedValue(userData)

            const result = await service.removeOneUser(userData.id)
    
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
            expect(usersRepository.findOne).toHaveBeenCalledWith({where:{id:userData.id}})

            //await usersRepository.delete({ user: { id: user.id } })
            expect(usersRepository.delete).toHaveBeenCalledTimes(1)
            expect(usersRepository.delete).toHaveBeenCalledWith(userData.id)

            
            expect(result).toEqual({
                ok:true,
                user:userData,
              })
        })
        it('should fail if no user is found',async()=>{
            const result = await service.removeOneUser(userData.id)
            expect(result).toEqual({
                ok:false, 
                error:'User Not Found'
            })
        })
    });
    describe('editProfile',()=>{
        it("should change email",async () => {
              const oldUser={
                id: 1,
                email: 'bs@old.com',
                verified: true,
              }
            const editProfileArgs = {
                userId:1,
                input:{email:"bs@new.com"},
            }
            const newVerification = {
                code:"code"
            }
            const newUser={
                id: 1,
                email:editProfileArgs.input.email,
                verified:false,
            }

            usersRepository.findOne.mockResolvedValue(oldUser)
            //verificationsRepository.delete.mockResolvedValue(oldUser)
            verificationsRepository.create.mockReturnValue(newVerification)
            verificationsRepository.save.mockReturnValue(newVerification)


            await service.editProfile(editProfileArgs.userId, editProfileArgs.input)//1,{email,password}
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
            expect(usersRepository.findOne).toHaveBeenCalledWith({where:{id:editProfileArgs.userId}})

            expect(verificationsRepository.delete).toHaveBeenCalledTimes(1)
            // console.log("editProfileArgs.userId 값 확인 : ",editProfileArgs.userId)
            expect(verificationsRepository.delete).toHaveBeenCalledWith({ user: { id: oldUser.id } })//{ user: { id: oldUser.id } }
            //{ user: { id: editProfileArgs.userId } }
            expect(verificationsRepository.create).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.create).toHaveBeenCalledWith({user:newUser})

            expect(verificationsRepository.save).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.save).toHaveBeenCalledWith(newVerification)

            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(newUser.email, newVerification.code)
        })
        it("should change password", async()=>{
            const editProfileArgs={
                userId:1,
                input:{password:'newPassword'},
            }
            usersRepository.findOne.mockResolvedValue({password:"old"}) //findOne이 password:"old" 리턴
            const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input)
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input); //password:'newPassword'를 예상
            expect(result).toEqual({ok:true,})
        })
        it("should fail on exception", async()=>{
            usersRepository.findOne.mockRejectedValue(new Error())
            const result = await service.editProfile(1, {email:'12'})
            expect(result).toEqual({ok: false, error: 'Could not update profile.'})
        })
    });

    describe('verifyEmail',() => {
        it("should verify email", async()=>{
            const mockedVerification={
                user:{
                    verified: false,
                },
                id:1
            }

            verificationsRepository.findOne.mockResolvedValue(mockedVerification)
            const result = await service.verifyEmail("")
            expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
            )
            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith({verified:true})

            expect(verificationsRepository.delete).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.delete).toHaveBeenCalledWith(mockedVerification.id,)

            expect(result).toEqual({ok:true})
        })
        it("should fail on verification not found",async()=>{
            verificationsRepository.findOne.mockResolvedValue(undefined)
            const result = await service.verifyEmail("")
            expect(result).toEqual({ok:false, error:"Verification not found"})
        })
        it("should fail on exception",async()=>{
            verificationsRepository.findOne.mockResolvedValue(new Error())
            const result = await service.verifyEmail("")
            expect(result).toEqual({ok:false, error:"Could not verify email"})
        })
    });

    describe('findById',()=>{
        const findByIdArgs = {
            id:1
        }
        it('should find an existing user', async()=>{
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs)
            const result = await service.findById(1)
            expect(result).toEqual({ok:true, user:findByIdArgs})
        })
        it('should fail if no user is found', async()=>{
            usersRepository.findOneOrFail.mockRejectedValue(new Error())
            const result = await service.findById(1)
            expect(result).toEqual({ok:false, error:'User Not Found'})
        })
    });
})