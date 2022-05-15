import { IsNumber } from "class-validator";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CoreEntity{

 @PrimaryGeneratedColumn()
 @IsNumber()
 id:number;

 @CreateDateColumn()
 createdAt:Date;

 @UpdateDateColumn()
 updatedAt:Date;

}