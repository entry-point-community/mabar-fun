import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDTO, GetEventsDTO, RegisterEventDTO } from '@v6/dto';

import { SupabaseGuard } from '../auth/supabase/supabase.guard';
import { AuthUser } from '../auth/types';
import { User } from '../auth/user.decorator';
import { PaginationService } from '../pagination/pagination.service';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly paginationService: PaginationService,
  ) {}

  @Get()
  public async getEvents(@Query() query: GetEventsDTO) {
    const { count, records } = await this.eventService.getEvents(query);

    return await this.paginationService.buildPaginationResponse(records, {
      count,
    });
  }

  @Get('/:eventId')
  public async getEventById(@Param('eventId') eventId: number) {
    const event = await this.eventService.getEventById(eventId);

    return event;
  }

  @Post('/:eventId/event-registrations')
  @UseGuards(SupabaseGuard)
  public async registerUserToEvent(
    @Param('eventId') eventId: number,
    @User() user: AuthUser,
    @Body() registerEventDTO: RegisterEventDTO,
  ) {
    const eventRegistration = await this.eventService.registerToEvent(
      user.sub,
      {
        eventId,
        mlbbRole: registerEventDTO.mlbbRole,
      },
    );

    return eventRegistration;
  }

  @Post()
  @UseGuards(SupabaseGuard)
  public async createEvent(
    @Body() createEventDTO: CreateEventDTO,
    @User() user: AuthUser,
  ) {
    const event = await this.eventService.createEvent(createEventDTO, user.sub);

    return event;
  }
}
