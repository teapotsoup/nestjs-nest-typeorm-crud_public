import { Column } from "typeorm";
import { CoreOutput } from "./output.dto";

export class PaginationInput{
    @Column({default:1})
    page: number
}

export class PaginationOutput extends CoreOutput{
    @Column({nullable:true})
    totalPages?:number
    @Column({nullable:true})
    totalResults?:number
}