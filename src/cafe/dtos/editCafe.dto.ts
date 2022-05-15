import { PartialType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { CreateCafeInput } from "./createCafe.dto";


export class EditCafeInput extends PartialType(CreateCafeInput){

    @Column("number")
    cafeId:number
}

export class EditCafeOutput extends CoreOutput{}