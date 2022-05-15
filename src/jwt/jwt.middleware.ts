import {  Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction,Request,Response } from "express";
import { decode } from "punycode";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware{
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService:UsersService){
    }
    async use(req:Request, res: Response, next:NextFunction){
        if('x-jwt' in req.headers){
            const token=req.headers['x-jwt'];//29
            console.log("부호화 전 토큰 키 : ",token)
                try{
                    const decoded = this.jwtService.verify(token.toString())
                    console.log("해석된 토큰 키 : ",decoded)
                    if(typeof decoded === "object" && decoded.hasOwnProperty('id')){
                        const user = await this.usersService.findById(decoded['id'])
                        console.log("키에 맞는 사용자 정보 : ",user)
                        req['user']=user
                    }
                }catch(e){
                }
            
        }
        next()
    }
}