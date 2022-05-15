import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";


export class DeleteCafeInput {
    
    @Column("number")
    cafeId:number
}

export class DeleteCafeOutput extends CoreOutput{}