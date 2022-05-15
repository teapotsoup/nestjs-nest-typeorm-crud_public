import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
    providers:[{
        provide:APP_GUARD, //앱가드가 모든곳에 적용
        useClass:AuthGuard
    }]
})
export class AuthModule {}
