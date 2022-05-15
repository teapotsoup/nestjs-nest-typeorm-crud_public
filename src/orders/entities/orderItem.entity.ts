import { Dish, DishChoice, DishOption } from "src/cafe/entities/dish.entity";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne } from "typeorm";


export class OrderItemOption{
    @Column()
    name:string

    @Column({nullable:true})
    choice?:string

    @Column({nullable:true})
    extra?:number
}

@Entity()
export class OrderItem extends CoreEntity{
    @ManyToOne(
        type=>Dish,
        {nullable:true, onDelete:"CASCADE"}
    )
    dish: Dish

    @Column({type:'json', nullable:true})
    options?:OrderItemOption[]
}