import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Order } from "../entities/order.entity";

export class GetOrderInput extends PickType(Order, ['id']){}

export class GetOrderOutput extends CoreOutput{
    @Column({nullable:true})
    order?:Order
}
