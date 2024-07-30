/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Role } from '../../../auth/enums/roles.enum';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @MaxLength(40)
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @MaxLength(40)
  lastName: string;

  @ApiProperty({ example: 'email@demo.com' })
  @IsEmail()
  @MaxLength(40)
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  @MaxLength(80)
  password: string;

  @ApiProperty({ example: ['guest', 'admin'] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
