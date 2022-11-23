import { UserType } from './user.type';

export default interface UserResponse {
  user: UserType & { token: string };
}
