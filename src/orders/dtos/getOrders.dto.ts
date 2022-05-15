import { extend } from "joi";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Order, OrderStatus } from "../entities/order.entity";

export class GetOrdersInput{
    @Column({nullable:true})
    status?:OrderStatus
}


export class GetOrdersOutput extends CoreOutput{
    @Column({nullable:true})
    orders?:Order[]
}