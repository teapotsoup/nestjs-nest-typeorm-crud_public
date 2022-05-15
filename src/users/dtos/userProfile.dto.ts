import { IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Column,} from "typeorm";
import { UserEntity } from "../entities/users.entity";


export class UserProfileInput{

    @Column()
    @IsNumber()
    userId:number;
}

export class UserProfileOutput extends CoreOutput{

    @Column({ nullable: true})
    user?:UserEntity
}