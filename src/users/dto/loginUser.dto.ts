import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
