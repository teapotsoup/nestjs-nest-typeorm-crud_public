import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";
import { Cafe } from "../entities/cafe.entity";

export class CafeInput{
    @Column()
    cafeId:"number"
}

export class CafeOutput extends CoreOutput{
    @Column({nullable:true})
    cafe?: Cafe
}