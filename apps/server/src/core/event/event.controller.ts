import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateEventDTO,
  GetEventsDTO,
  RegisterEventDTO,
  UpdateEventDTO,
} from '@v6/dto';

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

  @Get('/:eventId/teams')
  public async getEventTeams(@Param('eventId') eventId: number) {
    const eventTeams = await this.eventService.getEventTeams(eventId);

    return eventTeams;
  }

  @Post('/:eventId/teams')
  @UseGuards(SupabaseGuard)
  public async createTeamForEvent(
    @User() user: AuthUser,
    @Param('eventId') eventId: number,
  ) {
    const team = await this.eventService.createTeamForEvent(eventId, user.sub);

    return team;
  }

  @Get('/:eventId/players')
  public async getEventRegisteredPlayers(@Param('eventId') eventId: number) {
    const registeredPlayers =
      await this.eventService.getEventRegisteredPlayers(eventId);

    return registeredPlayers;
  }

  @Patch('/:eventId')
  @UseGuards(SupabaseGuard)
  public async updateEvent(
    @User() user: AuthUser,
    @Param('eventId') eventId: number,
    @Body() updateEventDTO: UpdateEventDTO,
  ) {
    const updatedEvent = await this.eventService.updateEvent(
      user.sub,
      eventId,
      updateEventDTO,
    );

    return updatedEvent;
  }

  @Delete('/:eventId/players/:playerId')
  @UseGuards(SupabaseGuard)
  public async removeRegisteredPlayer(
    @Param('eventId') eventId: number,
    @Param('playerId') playerId: string,
    @User() user: AuthUser,
  ) {
    await this.eventService.removePlayerFromEvent(eventId, playerId, user.sub);
  }
}
