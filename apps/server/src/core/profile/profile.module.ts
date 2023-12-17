import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { config } from '~/config';
import { PrismaService } from '~/lib/prisma.service';
import { SupabaseService } from '~/lib/supabase.service';
import { PaginationService } from '../pagination/pagination.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: config.apiGamesBaseUrl,
    }),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    PrismaService,
    SupabaseService,
    PaginationService,
  ],
})
export class ProfileModule {}
