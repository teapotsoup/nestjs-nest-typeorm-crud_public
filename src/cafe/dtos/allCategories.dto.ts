import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Category } from "../entities/category.entity";

export class AllCategoriesOutput extends CoreOutput{

    @Column({nullable:true})
    categories?:Category[]

}
