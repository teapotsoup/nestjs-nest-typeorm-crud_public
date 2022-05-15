import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { CafeModule } from './cafe/cafe.module';
import { Cafe } from './cafe/entities/cafe.entity';
import { Category } from './cafe/entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { Dish } from './cafe/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/orderItem.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', //prod 환경이면 Config모듈이 이 환경변수 파일을 무시한다
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(), //토큰을 지정하기 위해 사용하는 privateKey
        MAILGUN_API_KEY:Joi.string().required(),
        MAILGUN_DOMAIN_NAME:Joi.string().required(),
        MAILGUN_FROM_EMAIL:Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, //process.env.NODE_ENV !== 'prod'
      //autoLoadEntities: true,
      logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [UserEntity, Verification,Cafe,Category,Dish,Order,OrderItem], //
    }),
    AuthModule,
    UsersModule,
    CafeModule,
    OrdersModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey:process.env.MAILGUN_API_KEY,
      domain:process.env.MAILGUN_DOMAIN_NAME, //여기서 메일을 보낸다
      fromEmail:process.env.MAILGUN_FROM_EMAIL, //
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})

//export class AppModule{}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/*', ///users/*
      method: RequestMethod.ALL,
    });
  }
}
