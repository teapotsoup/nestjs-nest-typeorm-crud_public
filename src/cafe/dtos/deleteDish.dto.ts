import { CoreOutput } from "src/common/dtos/output.dto";
import { Column } from "typeorm";

export class DeleteDishInput{
    @Column()
    dishId: number
}

export class DeleteDishOutput extends CoreOutput{}
