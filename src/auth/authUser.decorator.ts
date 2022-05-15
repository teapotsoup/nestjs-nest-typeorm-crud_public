import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); //그래프큐엘 없이 테스트
    //console.log("리퀘스트 전체: ", request)
    const allUserData = request.user;
    console.log("리퀘스트 유저 : ",allUserData)
    const userData= (Object.values(allUserData)[1])
    //const userDataId= Object.values(Object.values(allUserData)[1])[0]
    console.log("userData  : ", userData); 
    return userData
  },
);
