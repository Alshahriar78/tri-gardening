import { IsNotEmpty, IsString } from "class-validator";



export class CreateUsersRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}