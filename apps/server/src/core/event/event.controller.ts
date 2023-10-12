import { Controller, Get, Query } from '@nestjs/common';
import { GetEventsDTO } from '@v6/dto';

import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  public async getEvents(@Query() query: GetEventsDTO) {
    const events = await this.eventService.getEvents(query);

    return events;
  }
}
