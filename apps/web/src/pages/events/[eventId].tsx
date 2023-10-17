import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getEventById } from '@v6/api';
import { MlbbRole, Prisma } from '@v6/db';
import { format } from 'date-fns';
import {
  IoCalendar,
  IoCloseCircle,
  IoLocation,
  IoPerson,
} from 'react-icons/io5';

import { mlbbRoleEnumToText } from '~/utils/role';
import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { RegisterEventForm } from '~/features/events/event-details/components';
import { axios } from '~/lib/axios';

interface EventDetailProps {
  title: string;
  registeredPlayers: Prisma.EventRegistrationGetPayload<{
    include: { player: true };
  }>[];
  description: string;
  displayName: string;
  profilePictureUrl: string | null;
  startRegistrationDate: Date;
  endRegistrationDate: Date;
  livestreamUrl: string | null;
  maxPlayers: number | null;
}

const EventDetail: React.FC<EventDetailProps> = ({
  title,
  registeredPlayers,
  description,
  displayName,
  profilePictureUrl,
  startRegistrationDate,
  endRegistrationDate,
  livestreamUrl,
  maxPlayers,
}) => {
  console.log(startRegistrationDate);
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);

  return (
    <>
      <HeadMetaData />
      <main className="md:container md:grid md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <AspectRatio ratio={1 / 1}>
            <Avatar className="h-full w-full rounded-md">
              <AvatarFallback className="rounded-md">TM</AvatarFallback>
              <AvatarImage
                className="rounded-md"
                src={profilePictureUrl || ''}
              />
            </Avatar>
          </AspectRatio>
          <p className="hidden text-center text-lg md:inline-block">
            {displayName}
          </p>
        </div>

        <section className="container col-span-3 mt-6 flex flex-col gap-2 md:mt-0">
          <p className="text-sm md:hidden">{displayName}</p>
          <h1 className="text-2xl font-semibold">{title}</h1>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <IoCalendar />{' '}
              <span>
                {format(new Date(startRegistrationDate), 'dd MMMM yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IoCloseCircle />{' '}
              <span>
                {format(new Date(endRegistrationDate), 'dd MMMM yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IoPerson />{' '}
              <span>{!maxPlayers ? 'Unlimited' : maxPlayers} slots</span>
            </div>
            {!!livestreamUrl && (
              <div className="flex items-center gap-2">
                <IoLocation /> <span>{livestreamUrl}</span>
              </div>
            )}
          </div>

          {!!description && (
            <p className="mt-2 max-w-lg rounded-md border p-4 text-sm text-muted-foreground">
              {description}
            </p>
          )}

          <Button
            onClick={() => setSheetOpened(true)}
            className="mt-2 w-full self-start md:hidden"
          >
            Join event
          </Button>

          <Button
            onClick={() => setDialogOpened(true)}
            className="mt-2 hidden self-start md:inline-block"
          >
            Join event
          </Button>

          <div className="mt-3 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">
              Players terdaftar ({registeredPlayers.length})
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Input className="mb-2" placeholder="Cari nickname player" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Cari role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MlbbRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {mlbbRoleEnumToText(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {registeredPlayers.map((registeredPlayer) => {
                return (
                  <div
                    className="col-span-full flex justify-between rounded-md bg-secondary px-3 py-1.5 text-sm md:col-span-1"
                    key={registeredPlayer.profileUserId}
                  >
                    <p>{registeredPlayer.player.mlbbUsername}</p>
                    <p className="text-muted-foreground">
                      {mlbbRoleEnumToText(registeredPlayer.role)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Sheet open={sheetOpened} onOpenChange={setSheetOpened}>
          <SheetContent side="bottom">
            <SheetHeader className="text-left">
              <SheetTitle>Daftar event</SheetTitle>
            </SheetHeader>
            <RegisterEventForm playerRoles={registeredPlayers} />
          </SheetContent>
        </Sheet>

        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daftar event</DialogTitle>
            </DialogHeader>
            <RegisterEventForm playerRoles={registeredPlayers} />
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  EventDetailProps,
  { eventId: string }
> = async ({ params }) => {
  const { data: event } = await getEventById(parseInt(params!.eventId), {
    axios,
  });

  if (!event) {
    return {
      notFound: true,
    };
  }

  const {
    creator,
    description,
    livestreamUrl,
    startRegistrationDate,
    endRegistrationDate,
    title,
    EventRegistration,
    maxPlayers,
  } = event;

  return {
    props: {
      title,
      registeredPlayers: EventRegistration,
      description,
      displayName: creator.displayName as string,
      profilePictureUrl: creator.profilePictureUrl,
      username: creator.mlbbUsername,
      startRegistrationDate,
      endRegistrationDate,
      livestreamUrl,
      maxPlayers,
    },
  };
};

export default EventDetail;
