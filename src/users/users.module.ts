import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [AbilityModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
