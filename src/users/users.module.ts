import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { Verification } from './entities/verification.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity, Verification])], 
    controllers:[UsersController],
    providers:[UsersService],
    exports:[UsersService]
})
export class UsersModule {}
