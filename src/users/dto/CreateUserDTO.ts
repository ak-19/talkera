import { IsNotEmpty, IsString } from "class-validator";

export default class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
