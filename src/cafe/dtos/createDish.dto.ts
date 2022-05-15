import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Dish } from "../entities/dish.entity";


export class CreateDishInput extends PickType(Dish,[
    'name',
    'price',
    'description',
    'options'
]){

    @Column()
    cafeId:number

}

export class CreateDishOutput extends CoreOutput{}