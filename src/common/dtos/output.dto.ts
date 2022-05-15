import { IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";


@Entity()
export class CoreOutput{ //전 MutationOutput
    @IsString()
    error?: string;

    @IsNotEmpty()
    ok : boolean;
}