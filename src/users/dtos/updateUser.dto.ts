import {  PartialType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Entity } from "typeorm";
import { UserEntity } from "../entities/users.entity";

//만들었는데 안씀
export class UpdateUserDto extends PartialType(UserEntity){}

//얘 씀
export class EditProfileInput extends PartialType(UserEntity){}

export class EditProfileOutput extends CoreOutput{}