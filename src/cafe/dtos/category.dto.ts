import { CoreOutput } from "src/common/dtos/output.dto";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { BeforeInsert, BeforeUpdate, Column } from "typeorm";
import { Category } from "../entities/category.entity";

export class CategoryInput extends PaginationInput{
    @Column("string")
    slug:string

}

export class CategoryOutput extends PaginationOutput{
    @Column({nullable:true})
    category?:Category

    @Column({nullable:true})
    cafeCount?:number

}