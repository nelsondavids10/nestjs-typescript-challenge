/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Agent } from '../sales/models/agent.entity';
import { Customer } from '../sales/models/customer.entity';
import { Order } from '../sales/models/order.entity';
import { AgentController } from './controllers/agent/agent.controller';
import { CustomerController } from './controllers/customer/customer.controller';
import { OrderController } from './controllers/order/order.controller';
import { AgentService } from './services/agent/agent.service';
import { CustomerService } from './services/customer/customer.service';
import { OrderService } from './services/order/order.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Customer, Order]),
    AuthModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  })],
  controllers: [AgentController, CustomerController, OrderController],
  providers: [AgentService, CustomerService, OrderService, RolesGuard],
})
export class SalesModule { }
