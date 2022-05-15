import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserEntity } from 'src/users/entities/users.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/editOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders.dto';
import { OrderService } from './orders.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('sendOrder')
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: UserEntity,
    @Body() createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return await this.orderService.createOrder(customer, createOrderInput)
  }

  @Post("getOrders")
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: UserEntity,
    @Body() getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user,getOrdersInput)
  }
  
  @Post("getOrder")
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: UserEntity,
    @Body() getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.orderService.getOrder(user,getOrderInput)
  }

  @Post("editOrder")
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: UserEntity,
    @Body() editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user,editOrderInput)
  }
}
