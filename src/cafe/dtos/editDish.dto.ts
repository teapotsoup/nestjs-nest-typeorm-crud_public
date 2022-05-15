import { PartialType, PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Dish } from "../entities/dish.entity";

export class EditDishInput extends PickType(PartialType(Dish), ["name", "options", "price", "description"])
{
    @Column()
    dishId:number
}

export class EditDishOutput extends CoreOutput{}