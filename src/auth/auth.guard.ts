import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserEntity } from "src/users/entities/users.entity";
import { AllowedRoles } from "./role.decorator";

//guard는 함수, 요청을 다음 단계로 진행할지 말지 결정한다.
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}
    canActivate(context: ExecutionContext){ 
        const role = this.reflector.get<AllowedRoles>(
            'role',
            context.getHandler(),
        );
        if(!role){ //라우터에 메타데이터 없다면 퍼블릭, canActivate는 true
            return true
        }
        console.log("role 확인 : ",role)
        const request = context.switchToHttp().getRequest(); 
        const user:UserEntity = request.user;
        console.log("바디 유저 : " ,user)
        if(!user){
            return false; //라우터에 메타데이터 있는데 로그인(헤더에 토큰)안하면 false
        }
        if(role.includes("Any")){
            return true; //메타데이터, 토큰 있고 role에 Any있으면 true
        }
        return role.includes(Object.values(user)[1].role)
    }
}