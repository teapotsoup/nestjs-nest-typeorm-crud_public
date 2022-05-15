import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Cafe } from 'src/cafe/entities/cafe.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Dish } from 'src/cafe/entities/dish.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Cafe,OrderItem,Dish])], 
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrdersModule {}


// controllers:[UsersController],
// providers:[UsersService],
// exports:[UsersService]