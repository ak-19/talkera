import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import UserRequest from "../type/userRequest.interface";

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<UserRequest>();

        if (request.user) return true;

        throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
}