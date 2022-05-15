import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Cafe } from "../entities/cafe.entity";

export class CreateCafeInput extends PickType(Cafe, ["name","coverImg","address"] as const){
    categoryName: string;
}

export class CreateCafeOutput extends CoreOutput{}