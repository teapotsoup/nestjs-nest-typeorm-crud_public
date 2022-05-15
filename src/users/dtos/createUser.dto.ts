import { PartialType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Entity } from "typeorm";
import { UserEntity } from "../entities/users.entity";


export class CreateAccountInput extends PartialType(UserEntity){}


export class CreateAccountOutput extends CoreOutput{}