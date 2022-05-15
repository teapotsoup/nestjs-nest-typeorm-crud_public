import { InternalServerErrorException } from "@nestjs/common";
import {  IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import * as bcrypt from "bcrypt";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "src/common/entities/core.entity";
import { Cafe } from "src/cafe/entities/cafe.entity";
import { Order } from "src/orders/entities/order.entity";



export enum UserRole {
    Client = 'Client',
    Owner ='Owner',
    Delivery ='Delivery'
}
@Entity()
export class UserEntity extends CoreEntity {

    @Column()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @Column({select:false}) // save시 재 변경 방지를 위한 코드
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column({type:"enum", enum:UserRole, default:UserRole.Client})
    @IsEnum(UserRole)
    role: UserRole;

    @Column({default:false})
    //@IsBoolean()
    verified:boolean

    // @Column("Cafe")
    @OneToMany(type=>Cafe, cafe=>cafe.owner)
    cafes:Cafe[]; 

    @OneToMany(type=>Order, order=>order.customer)
    orders:Order[]; 

    @OneToMany(type=>Order, order=>order.driver)
    rides:Order[]; 

    @BeforeInsert() //DB저장전에
    @BeforeUpdate()
    async hashPassword(): Promise<void>{
        if(this.password){
            try{
                this.password = await bcrypt.hash(this.password,10); //PASSWORD를 받아서 hash
    
            }catch(e){
                console.log(e);
                throw new InternalServerErrorException()
            }
        }
    }

    //매개변수 받는 버전
    async hashPasswordParam(pw:string): Promise<string>{
        try{
            pw = await bcrypt.hash(pw,10); //PASSWORD를 받아서 hash
            return pw

        }catch(e){
            console.log(e);
            throw new InternalServerErrorException()
        }
    }

    async checkPassword(aPassword:string): Promise<boolean>{
        try{
            const ok = await bcrypt.compare(aPassword, this.password)
            return ok;
        }
        catch(e){
            console.log(e)
            throw new InternalServerErrorException();
        }
    }
}