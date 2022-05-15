import { PartialType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Entity } from "typeorm";
import { Verification } from "../entities/verification.entity";


export class VerifyEmailInput extends PartialType(Verification){}

export class VerifyEmailOutput extends CoreOutput{}