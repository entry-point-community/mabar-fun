import { Module } from '@nestjs/common';

import { PrismaService } from '~/lib/prisma.service';
import { SupabaseService } from '~/lib/supabase.service';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, SupabaseService],
})
export class EventModule {}
