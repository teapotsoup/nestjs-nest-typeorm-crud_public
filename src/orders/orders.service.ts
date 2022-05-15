import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { retry } from 'rxjs';
import { Cafe } from 'src/cafe/entities/cafe.entity';
import { Dish, DishOption } from 'src/cafe/entities/dish.entity';
import { UserEntity, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/editOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,

    @InjectRepository(Cafe)
    private readonly cafes: Repository<Cafe>,

    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}
  async createOrder(
    customer: UserEntity,
    { cafeId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const cafe = await this.cafes.findOne({ where: { id: cafeId } });
      if (!cafe) {
        return {
          ok: false,
          error: 'Cafe not found',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne({ where: { id: item.dishId } });
        if (!dish) {
          return {
            ok: false,
            error: 'Dish not found',
          };
        }
        let dishFinalPrice = dish.price;
        console.log(`Dish price : ${dish.price}`);
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                }
              }
            }
          }
          // console.log(itemOption.name, dishOption.name)
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          cafe,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      return {
        ok: true,
        order: order,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create order',
      };
    }
  }
  async getOrders(
    user: UserEntity,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    let orders: Order[];
    try {
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({ where: { 
          customer: user,
          ...(status && {status}),
         } });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({ where: { 
          driver: user,
          ...(status && {status}) } });
      } else if (user.role === UserRole.Owner) {
        const cafes = await this.cafes.find({
          where: { owner: user },
          relations: ['orders'],
        });
        orders = cafes.map((cafe) => cafe.orders).flat(1);
        if(status){
          orders = orders.filter(order => order.status === status)
        }
      }
      return {
        ok: true,
        orders,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not get orders',
      };
    }
  }

  canSeeorder(user:UserEntity, order:Order):boolean{
    let canSee = true
    if(user.role === UserRole.Client && order.customerId !== user.id){
      canSee:false
    }
    if(user.role === UserRole.Delivery && order.driverId !== user.id){
      canSee:false
    }
    if(user.role === UserRole.Owner && order.cafe.ownerId !== user.id){
      canSee:false
    }
    return canSee
  }
  async getOrder(
    user: UserEntity,
    { id:orderId }: GetOrderInput, //orderId로 사용
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId ,{relations:['cafe'] });
      if(!order){
        return {
          ok:false,
          error:"Order not found.",
        }
      }
      if(!this.canSeeorder(user, order)){
        return{
          ok:false,
          error:"Can't see this"
        }
      }
      return{
        ok:true,
        order,
      }
    } catch (error) {
      return{
        ok: false,
        error: 'Could not get order',
      }
    }
  }
  async editOrder(
    user: UserEntity,
    {id:orderId,status}: EditOrderInput, //orderId로 사용 
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId ,{relations:['cafe'] });
      if(!order){
        return {
          ok:false,
          error:"Order not found.",
        }
      }
      if(!this.canSeeorder(user, order)){
        return{
          ok:false,
          error:"Can't see this"
        }
      }
      let canEdit = true
      if(user.role === UserRole.Client){
        canEdit=false
      }
      if(user.role === UserRole.Owner){
        if(status !== OrderStatus.Cooking && status !== OrderStatus.Cooked){
          canEdit=false
        }
      }
      if(user.role === UserRole.Delivery){
        if(status !== OrderStatus.PickedUp && status !== OrderStatus.Delivered){
          canEdit=false
        }
      }
      if (!canEdit){
        return{
          ok:false,
          error:"You can't do that"
        }
      }
      await this.orders.save([{
        id:orderId,
        status
      }])
      return{
        ok:true
      }
    } catch (error) {
      return{
        ok: false,
        error: 'Could not order edit',
      }
    }
  }
}
