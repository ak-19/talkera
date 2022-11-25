import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateUserDTO {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly bio: string;
  readonly image: string;
}
