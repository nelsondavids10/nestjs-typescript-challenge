/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('Required Roles:', requiredRoles); // Añadido para depuración

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return false;
        }

        let user;
        try {
            user = this.jwtService.verify(token);
            console.log('Decoded User:', user); // Añadido para depuración
        } catch (error) {
            console.error('JWT Error:', error); // Añadido para depuración
            return false;
        }

        return requiredRoles.some((role) => user.roles?.includes(role));
    }
}
