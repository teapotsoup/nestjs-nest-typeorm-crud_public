import { IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { Cafe } from "./cafe.entity";

//InputType이 스키마에 포함되길 원치 않음 확장의 의미를 가지는 abstract {isAbstract:true}
@Entity()
export class Category extends CoreEntity{

    @Column({unique:true})
    @IsString()
    @Length(5)
    name:string;

    @Column({nullable: true})
    @IsString()
    coverImg:string;

    @Column({unique:true})
    @IsString()
    slug: string
    
    @OneToMany(type=>Cafe, cafe=>cafe.category, { nullable: true })
    @JoinColumn()
    cafes:Cafe[];    //하나의 카테고리는 많은 카페를 가질수 있다 (일대다, 1:N relationship)

    // @Column({default:0})
    // cafeCount?:number

    // @BeforeInsert() //DB저장전에
    // @BeforeUpdate()
    // async countCafe(){
    //     console.log("this.cafes.length : ",this.cafes.length)
    //     this.cafeCount = this.cafes.length
    // }
}
