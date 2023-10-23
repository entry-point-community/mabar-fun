import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetEventsDTO, RegisterEventDTO } from '@v6/dto';

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

  public async registerToEvent(
    userId: string,
    { mlbbRole, eventId }: RegisterEventDTO & { eventId: number },
  ) {
    const [findUserRegisteredToEvent, event] = await Promise.all([
      this.prismaService.eventRegistration.findUnique({
        where: {
          eventId_profileUserId: {
            eventId,
            profileUserId: userId,
          },
        },
      }),
      this.prismaService.event.findUnique({
        where: {
          id: eventId,
        },
      }),
    ]);

    if (!event) {
      throw new NotFoundException('event not found');
    }

    if (event.profileUserId === userId) {
      throw new UnprocessableEntityException('unable to join owned event');
    }

    const now = new Date();

    if (now < event.startRegistrationDate) {
      throw new UnprocessableEntityException('registration is not opened yet');
    }

    if (now > event.endRegistrationDate) {
      throw new UnprocessableEntityException('registration window has passed');
    }

    if (findUserRegisteredToEvent) {
      throw new UnprocessableEntityException(
        'user has already been registered to the event',
      );
    }

    return await this.prismaService.eventRegistration.create({
      data: {
        role: mlbbRole,
        eventId,
        profileUserId: userId,
      },
    });
  }
}
