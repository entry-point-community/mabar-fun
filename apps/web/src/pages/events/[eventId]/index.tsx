import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ExternalLinkIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useUser } from '@supabase/auth-helpers-react';
import {
  getEventById,
  useGetPlayersFromEventRealtime,
  useRegisterEventMutation,
} from '@v6/api';
import { Prisma } from '@v6/db';
import { RegisterEventDTO } from '@v6/dto';
import { supabaseClient } from '@v6/supabase/nextjs';
import { format, isFuture, isPast } from 'date-fns';
import { IoCalendar, IoCloseCircle, IoPerson } from 'react-icons/io5';
import { toast } from 'sonner';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  PlayersList,
  RegisterEventForm,
  TeamList,
} from '~/features/events/event-details/components';
import { axios } from '~/lib/axios';
import { supabase } from '~/lib/supabase';
import { cn } from '~/lib/utils';

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
  profileUserId: string;
  id: number;
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
  profileUserId,
  id,
}) => {
  const user = useUser();

  const [sheetOpened, setSheetOpened] = useState<boolean>(false);
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);

  const { mutate } = useRegisterEventMutation({
    onSuccess: () => {
      toast.success('Berhasil daftar event');
      window.location.reload();
    },
  });

  const handleRegisterEvent = ({ mlbbRole }: RegisterEventDTO) => {
    mutate({
      mlbbRole,
      eventId: id,
    });
  };

  const isPastEndRegistrationDate = isPast(new Date(endRegistrationDate));
  const isOwner = user?.id === profileUserId;
  const isBeforeStartRegistrationDate = isFuture(
    new Date(startRegistrationDate),
  );
  const isRegistered = registeredPlayers.some(
    (player) => player.profileUserId === user?.id,
  );

  const buttonIsDisabled =
    isPastEndRegistrationDate ||
    isOwner ||
    isBeforeStartRegistrationDate ||
    isRegistered ||
    !user;

  useGetPlayersFromEventRealtime(id, (payload) => {
    console.log(payload);
  });

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
          <div className="flex gap-2">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {isOwner && (
              <Link
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'rounded-full',
                )}
                href={`/events/${id}/edit`}
              >
                <Pencil1Icon className="h-6 w-6" />
              </Link>
            )}
          </div>

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
              <span>
                {!maxPlayers ? 'Unlimited' : maxPlayers} players quota
              </span>
            </div>
            {!!livestreamUrl && (
              <Button
                variant="destructive"
                size="sm"
                className="mt-1 flex w-fit items-center"
                asChild
              >
                <Link href={livestreamUrl} target="_blank">
                  Watch Live <ExternalLinkIcon className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>

          {!!description && (
            <p className="mt-2 max-w-lg rounded-md border p-4 text-sm text-muted-foreground">
              {description}
            </p>
          )}

          <Button
            disabled={buttonIsDisabled}
            onClick={() => setSheetOpened(true)}
            className="mt-2 w-full self-start md:hidden"
          >
            Join event
          </Button>

          <Button
            disabled={buttonIsDisabled}
            onClick={() => setDialogOpened(true)}
            className="mt-2 hidden self-start md:inline-block"
          >
            Join event
          </Button>

          <Tabs defaultValue="player" className="mt-6 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="player">Player list</TabsTrigger>
              <TabsTrigger value="team">Team list</TabsTrigger>
            </TabsList>
            <TabsContent value="player">
              <PlayersList registeredPlayers={registeredPlayers} />
            </TabsContent>
            <TabsContent value="team">
              <TeamList isOwner={isOwner} />
            </TabsContent>
          </Tabs>
        </section>

        <Sheet open={sheetOpened} onOpenChange={setSheetOpened}>
          <SheetContent side="bottom">
            <SheetHeader className="text-left">
              <SheetTitle>Daftar event</SheetTitle>
            </SheetHeader>
            <RegisterEventForm
              onRegister={handleRegisterEvent}
              playerRoles={registeredPlayers}
            />
          </SheetContent>
        </Sheet>

        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daftar event</DialogTitle>
            </DialogHeader>
            <RegisterEventForm
              onRegister={handleRegisterEvent}
              playerRoles={registeredPlayers}
            />
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
    profileUserId,
    id,
  } = event;

  // TODO: Refactor registered player data fetching, should be separate from event detail

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
      profileUserId,
      id,
    },
  };
};

export default EventDetail;
