import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetEventsDTO } from '@v6/dto';

import { PrismaService } from '~/lib/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getEvents(getEventsDTO: GetEventsDTO) {
    const { limit = 10, page = 1 } = getEventsDTO;

    const paginationParams: Pick<Prisma.EventCountArgs, 'skip' | 'take'> = {
      skip: (page - 1) * limit,
      take: limit,
    };

    const [records, count] = await this.prismaService.$transaction([
      this.prismaService.event.findMany({
        ...paginationParams,
        include: {
          creator: true,
          _count: {
            select: {
              EventRegistration: true,
            },
          },
        },
      }),
      this.prismaService.event.count({
        ...paginationParams,
      }),
    ]);

    return { records, count };
  }

  public async getEventById(eventId: number) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        creator: true,
        EventRegistration: {
          include: {
            player: true,
          },
        },
        EventTeam: {
          include: {
            EventTeamPlayer: {
              include: {
                player: true,
              },
            },
          },
        },
      },
    });

    if (!event) throw new NotFoundException('event not found');

    return event;
  }
}
