import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Order } from "../entities/order.entity";

export class EditOrderInput extends PickType(Order,["id", "status"]){}

export class EditOrderOutput extends CoreOutput{}