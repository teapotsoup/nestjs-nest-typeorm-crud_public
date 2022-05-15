import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

//InputType이 스키마에 포함되길 원치 않음 확장의 의미를 가지는 abstract {isAbstract:true}
@Entity()
export class Cafe extends CoreEntity {
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Column()
  @IsString()
  coverImg: string;

  @Column()
  @IsOptional() //해당 필드를 보내거나 보내지 않을 수 있다는 것을 의미
  @IsString()
  address: string;

  //카테고리를 지울때 cafe는 지우면 안된다
  //@Column()//{ nullable: true }
  @ManyToOne(
    (type) => Category, 
    (category) => category.cafes,
    {nullable: true, onDelete: 'SET NULL'}
     ) //카테고리가 없는 카페 생성도 가능 
  category: Category; //하나의 카페는 한 카테고리

  @ManyToOne(
    (type) => UserEntity, 
    (user) => user.cafes,
    {onDelete:'CASCADE'}
    )
  owner: UserEntity;

  @OneToMany(
    (type) => Order, 
    (order) => order.customer,
    )
  orders: Order[];


  @RelationId((cafe:Cafe)=>cafe.owner)
  ownerId:number

  @OneToMany(type=>Dish, dish=>dish.cafe,)
  menu:Dish[];    
}

