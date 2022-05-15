import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeService } from './cafe.service';
import { Cafe } from './entities/cafe.entity';
import { CafeController } from './cafe.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryController } from './category.controller';
import { Dish } from './entities/dish.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cafe, CategoryRepository, Dish])], //TypeORM을 써서 Cafe repository를 import
    controllers: [CafeController,CategoryController], // 레포지토리 사용을 위해
    providers:[CafeService], 
    exports:[CafeService]
})
export class CafeModule {}
