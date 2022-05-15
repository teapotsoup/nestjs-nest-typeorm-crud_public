import { IsEnum, IsNumber, IsString } from "class-validator";
import { userInfo } from "os";
import { Cafe } from "src/cafe/entities/cafe.entity";
import { Dish } from "src/cafe/entities/dish.entity";
import { CoreEntity } from "src/common/entities/core.entity";
import { UserEntity } from "src/users/entities/users.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { OrderItem } from "./orderItem.entity";

export enum OrderStatus{
    Pending = 'Pending',
    Cooking = 'Cooking',
    Cooked= 'Cooked',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered'
}


@Entity()
export class Order extends CoreEntity {

    @ManyToOne(
        (type) => UserEntity, 
        (user) => user.orders,
        {onDelete: 'SET NULL', nullable:true}
         ) 
    customer?:UserEntity

    @RelationId((order:Order)=>order.customer)
    customerId:number

    @ManyToOne(
        (type) => UserEntity, 
        (user) => user.rides,
        {onDelete: 'SET NULL', nullable:true}
         )
    driver?:UserEntity

    @RelationId((order:Order)=>order.driver)
    driverId:number

    @ManyToOne(
        (type) => Cafe, 
        (cafe) => cafe.orders,
        {onDelete: 'SET NULL', nullable:true}
         ) 
    cafe?:Cafe

    @ManyToMany(type=>OrderItem)
    @JoinTable()
    items: OrderItem[]

    @Column({nullable:true})
    @IsNumber()
    total?: number

    @Column({type:'enum',enum:OrderStatus, default:OrderStatus.Pending})
    @IsEnum(OrderStatus)
    status: OrderStatus
}