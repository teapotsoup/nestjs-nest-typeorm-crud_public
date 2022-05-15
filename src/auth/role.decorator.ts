import { SetMetadata, Type } from "@nestjs/common";
import { UserRole } from "src/users/entities/users.entity";

export type AllowedRoles = keyof typeof UserRole | "Any";

export const Role = (role:AllowedRoles[])=>SetMetadata("role", role); //키 값 구조로 저장
//해당 데코레이터는 메타데이터를 설정한다.
//메타데이터는 컨트롤러의 extra data이다.
//AllowedRoles[]는 배열로 role metadata key에 저장
//라우터에 메타데이터나 role이 없다면 public임

//Any는 유저가 로그인 돼있으면(헤더에 토큰 있으면 됨)