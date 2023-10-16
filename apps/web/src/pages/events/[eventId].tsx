import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getEventById } from '@v6/api';

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
  // description: string;
  // displayName: string;
  // username: string;
  // profilePictureUrl: string;
  // playersJoined: number;
  // totalMatches: number;
  // id: number;
}

const EventDetail: React.FC<EventDetailProps> = ({ title }) => {
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
                src="http://localhost:54321/storage/v1/object/public/profile-pictures/1697129641854-d749c822-58a1-4101-a0ba-db8dc6823933.jpeg"
              />
            </Avatar>
          </AspectRatio>
          <p className="hidden text-center text-lg text-muted-foreground md:inline-block">
            theodevoid voidfnc Lorem, ipsum.
          </p>
        </div>
        <section className="container col-span-3 mt-6 flex flex-col gap-2 md:mt-0">
          <h1 className="text-2xl font-semibold">
            {title} Lorem ipsum dolor sit amet.
          </h1>

          <p className="text-sm text-muted-foreground md:hidden">
            theodevoid voidfnc Lorem, ipsum.
          </p>

          <Button
            onClick={() => setSheetOpened(true)}
            className="mt-2 w-full self-start md:hidden"
            variant="secondary"
          >
            Join event
          </Button>

          <Button
            onClick={() => setDialogOpened(true)}
            className="mt-2 hidden self-start md:inline-block"
            variant="secondary"
          >
            Join event
          </Button>
        </section>

        <Sheet open={sheetOpened} onOpenChange={setSheetOpened}>
          <SheetContent side="bottom">
            <SheetHeader className="text-left">
              <SheetTitle>Daftar event</SheetTitle>
            </SheetHeader>
            <RegisterEventForm />
          </SheetContent>
        </Sheet>

        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daftar event</DialogTitle>
            </DialogHeader>
            <RegisterEventForm />
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
    startLiveDate,
    startRegistrationDate,
    status,
    title,
    totalMatches,
    EventTeam,
    EventRegistration,
  } = event;

  return {
    props: {
      title,
    },
  };
};

export default EventDetail;
