import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { Column } from "typeorm";
import { Cafe } from "../entities/cafe.entity";

export class CafesInput extends PaginationInput{

}

export class CafesOutput extends PaginationOutput{
    @Column({nullable:true})
    cafes?:Cafe[]
}