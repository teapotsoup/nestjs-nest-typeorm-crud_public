import { CoreOutput } from "src/common/dtos/output.dto";
import { OmitType} from '@nestjs/mapped-types';
import { UserEntity } from "../entities/users.entity";
import { CoreEntity } from "src/common/entities/core.entity";
import { Entity } from "typeorm";

export class LoginInput extends OmitType(UserEntity, ['id','createdAt','updatedAt','role','verified','hashPassword','hashPasswordParam','checkPassword'] as const){} 

export class LoginOutput extends CoreOutput{
    token?: string;
}