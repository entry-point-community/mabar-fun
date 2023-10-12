import { Controller, Get, Query } from '@nestjs/common';
import { GetEventsDTO } from '@v6/dto';

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
}
