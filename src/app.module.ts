import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AbilitesGuard } from './ability/abilities.guard';
import { AbilityModule } from './ability/ability.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AbilityModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AbilitesGuard }],
})
export class AppModule {}
