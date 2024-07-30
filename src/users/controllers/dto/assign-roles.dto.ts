/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../../auth/enums/roles.enum';

export class AssignRolesDto {
    @ApiProperty({ example: ['guest', 'admin', 'agent', 'customer'] })
    @IsArray()
    @IsEnum(Role, { each: true })
    @IsNotEmpty()
    roles: Role[];
}
