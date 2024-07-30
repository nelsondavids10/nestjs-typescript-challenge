/* eslint-disable prettier/prettier */
import { Controller, Patch, Body, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../models/user.entity';

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch('assign-roles/:email')
    @ApiOperation({ summary: 'Assign roles to a user by email' })
    @ApiBody({ type: AssignRolesDto })
    @ApiResponse({
        status: 200,
        description: 'Roles successfully assigned to the user',
        type: User,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async updateRoles(
        @Param('email') email: string,
        @Body() updateRolesDto: AssignRolesDto,
    ): Promise<User> {
        return this.usersService.assignRoles(email, updateRolesDto);
    }
}
