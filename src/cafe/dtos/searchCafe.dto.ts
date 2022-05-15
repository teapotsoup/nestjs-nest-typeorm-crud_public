import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { Column } from "typeorm";
import { Cafe } from "../entities/cafe.entity";

export class SearchCafeInput extends PaginationInput{
    @Column()
    query:string
}

export class SearchCafeOutput extends PaginationOutput{
    @Column({nullable:true})
    cafes?:Cafe[]
}
