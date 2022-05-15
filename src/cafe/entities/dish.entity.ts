import { IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId} from "typeorm";
import { Cafe } from "./cafe.entity";


export class DishChoice{
    @Column()
    name:string

    @Column({nullable:true})
    extra?:number
}

export class DishOption{
    @Column()
    name:string

    @Column({nullable:true})
    choices?:DishChoice[]

    @Column({nullable:true})
    extra?:number
}


@Entity()
export class Dish extends CoreEntity{

    @Column({unique:true})
    @IsString()
    @Length(5)
    name:string;

    @Column()
    @IsNumber()
    price: number

    @Column({nullable:true})
    @IsString()
    photo: string

    @Column()
    @IsString()
    description:string


    //식당은 많은 디시 디시는 한 식당
    @ManyToOne(
        (type) => Cafe, 
        (cafe) => cafe.menu,
        { onDelete: 'CASCADE'} //카페 지워지면 dish도 지워짐
         ) 
      cafe: Cafe;

    @RelationId((dish:Dish)=>dish.cafe)
    cafeId:number

    @Column({type:"json", nullable:true})
    options : DishOption []
}