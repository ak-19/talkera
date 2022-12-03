import { User } from "src/users/entity/user.entity";

export type Profile = Omit<User, 'email' | 'hashPassword' | 'articles' | 'favorites'>