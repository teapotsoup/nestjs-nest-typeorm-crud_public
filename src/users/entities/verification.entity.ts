import {v4 as uuidv4} from 'uuid';
import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./users.entity";


@Entity()
export class Verification extends CoreEntity {

    @Column()
    @IsString()
    code:string

    @OneToOne(type=>UserEntity, {onDelete:"CASCADE"})//, {cascade:true}// {onDelete:"CASCADE"}사용시 user와 붙어있는 verification도 같이 삭제
    @JoinColumn()
    user:UserEntity;

    @BeforeInsert()
    createCode():void{
        this.code = uuidv4()
    }

}
//Verification으로부터 user에 접근