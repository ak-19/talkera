import { UserType } from "src/users/type/user.type";

export type Profile = UserType & { following: boolean };