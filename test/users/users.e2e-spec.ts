/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/models/user.entity';
import { AssignRolesDto } from '../../src/users/controllers/dto/assign-roles.dto';
import { Role } from '../../src/auth/enums/roles.enum';

jest.mock('bcryptjs', () => {
    return {
        compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
    };
});

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    const mockUserRepository = {
        findOne: jest.fn().mockImplementation((options) => {
            if (options.where.email === 'jhon@demo.com') {
                return Promise.resolve({ id: 1, email: 'jhon@demo.com', roles: ['admin', 'agent'] });
            }
            return Promise.resolve(null);
        }),
        save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                AuthModule,
                UsersModule,
            ],
        })
            .overrideProvider(getRepositoryToken(User))
            .useValue(mockUserRepository)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                stopAtFirstError: true,
            }),
        );
        await app.init();
    });

    async function getValidToken() {
        const {
            body: { access_token },
        } = await request(app.getHttpServer()).post('/api/auth/login').send({
            email: 'jhon@demo.com',
            password: 'demo',
        });
        return access_token;
    }

    it('/api/users/assign-roles/:email (PATCH)', async () => {
        const rolesDto: AssignRolesDto = {
            roles: [Role.Admin, Role.Agent],
        };

        return request(app.getHttpServer())
            .patch('/api/users/assign-roles/jhon%40demo.com')
            .auth(await getValidToken(), { type: 'bearer' })
            .send(rolesDto)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect({
                id: 1,
                email: 'jhon@demo.com',
                roles: rolesDto.roles,
            });
    });

    it('/api/users/assign-roles/:email (PATCH) should fail because user not found', async () => {
        jest.spyOn(mockUserRepository, 'findOne').mockImplementation(() =>
            Promise.resolve(null),
        );

        const rolesDto: AssignRolesDto = {
            roles: [Role.Admin, Role.Agent],
        };

        return request(app.getHttpServer())
            .patch('/api/users/assign-roles/nonexistent%40demo.com')
            .auth(await getValidToken(), { type: 'bearer' })
            .send(rolesDto)
            .expect(404)
            .expect('Content-Type', /application\/json/)
            .expect({
                statusCode: 404,
                message: 'User not found',
                error: 'Not Found',
            });
    });

    it('/api/users/assign-roles/:email (PATCH) should fail because missing roles', async () => {
        return request(app.getHttpServer())
            .patch('/api/users/assign-roles/jhon%40demo.com')
            .auth(await getValidToken(), { type: 'bearer' })
            .send({})
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });

    it('/api/users/assign-roles/:email (PATCH) should fail because invalid roles', async () => {
        return request(app.getHttpServer())
            .patch('/api/users/assign-roles/jhon%40demo.com')
            .auth(await getValidToken(), { type: 'bearer' })
            .send({ roles: ['invalid-role'] })
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });
});
