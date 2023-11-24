import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateEventDTO,
  GetEventsDTO,
  RegisterEventDTO,
  UpdateEventDTO,
} from '@v6/dto';

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
    const [findUserRegisteredToEvent, event, userProfile] = await Promise.all([
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
      this.prismaService.profile.findUnique({
        where: {
          userId,
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

    if (!userProfile?.mlbbUsername) {
      throw new UnprocessableEntityException('user has no MLBB username');
    }

    return await this.prismaService.eventRegistration.create({
      data: {
        role: mlbbRole,
        eventId,
        profileUserId: userId,
      },
    });
  }

  public async createEvent(createEventDTO: CreateEventDTO, userId: string) {
    const { endRegistrationDate, startRegistrationDate } = createEventDTO;

    if (endRegistrationDate < startRegistrationDate) {
      throw new UnprocessableEntityException(
        "end registration date shouldn't be before start registration date",
      );
    }

    // REFACTOR THIS TO ANOTHER SERVICE
    const user = await this.prismaService.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!user?.isCreator) {
      throw new UnauthorizedException('user is not a creator');
    }

    const event = await this.prismaService.event.create({
      data: {
        ...createEventDTO,
        creator: {
          connect: {
            userId,
          },
        },
      },
    });

    return event;
  }

  public async getEventTeams(eventId: number) {
    const eventTeams = await this.prismaService.eventTeam.findMany({
      where: {
        eventId,
      },
      include: {
        EventTeamPlayer: {
          include: {
            player: true,
          },
        },
      },
    });

    return eventTeams;
  }

  public async createTeamForEvent(eventId: number, userId: string) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
        profileUserId: userId,
      },
    });

    if (!event) throw new NotFoundException('event not found');

    const team = await this.prismaService.eventTeam.create({
      data: {
        eventId,
      },
    });

    return team;
  }

  public async getEventRegisteredPlayers(eventId: number) {
    const players = await this.prismaService.eventRegistration.findMany({
      where: {
        eventId,
      },
      include: {
        player: {
          include: {
            EventTeamPlayer: {
              where: {
                eventId,
              },
            },
          },
        },
      },
    });

    return players;
  }

  public async updateEvent(
    userId: string,
    eventId: number,
    updateEventDTO: UpdateEventDTO,
  ) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('event not found');

    const updatedEvent = await this.prismaService.event.update({
      where: {
        profileUserId: userId,
        id: eventId,
      },
      data: {
        ...updateEventDTO,
      },
    });

    return updatedEvent;
  }
}
