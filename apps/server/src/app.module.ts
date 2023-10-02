import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SupabaseModule } from './core/auth/supabase/supabase.module';
import { ProfileModule } from './core/profile/profile.module';

@Module({
  imports: [PassportModule, SupabaseModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
