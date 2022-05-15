import { Cafe } from "src/cafe/entities/cafe.entity";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Order } from "../entities/order.entity";
import { OrderItem, OrderItemOption } from "../entities/orderItem.entity";

class CreateOrderItemInput{

    @Column()
    dishId:number

    @Column({nullable:true})
    options?: OrderItemOption[]
}


export class CreateOrderInput{

    @Column()
    cafeId:number

    @Column()
    items: CreateOrderItemInput[];
}

export class CreateOrderOutput extends CoreOutput{
    @Column({nullable:true})
    order?:Order
}