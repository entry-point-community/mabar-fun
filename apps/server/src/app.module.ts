import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SupabaseModule } from './core/auth/supabase/supabase.module';
import { EventModule } from './core/event/event.module';
import { LoggerMiddleware } from './core/logger/logger.middleware';
import { ProfileModule } from './core/profile/profile.module';
import { TeamModule } from './core/team/team.module';

@Module({
  imports: [
    PassportModule,
    SupabaseModule,
    ProfileModule,
    EventModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
