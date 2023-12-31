import { useState } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon } from '@radix-ui/react-icons';
import { useCreateTeamForEventMutation, useGetEventTeamsQuery } from '@v6/api';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { queryClient } from '~/lib/react-query';
import { TeamListItem } from './TeamListItem';

type TeamListProps = {
  isOwner: boolean;
};

export const TeamList: React.FC<TeamListProps> = ({ isOwner = false }) => {
  const router = useRouter();

  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const { data } = useGetEventTeamsQuery(
    parseInt(router.query.eventId as string),
    {
      enabled: router.isReady,
    },
  );

  const { mutate: createTeamForEvent } = useCreateTeamForEventMutation({
    onSuccess: async () => {
      setDialogIsOpen(false);
      toast.success('Berhasil membuat tim');
      await queryClient.invalidateQueries({
        queryKey: ['event-teams', Number(router.query.eventId)],
      });
    },
  });

  return (
    <div className="mt-3 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">
        Teams terbentuk ({data?.length})
      </h3>

      {isOwner && (
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger className="w-full">
            <Button
              variant="outline"
              className="text-md flex w-full gap-4 border-2 p-4 font-semibold"
            >
              Tambah tim <PlusIcon className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-w-[80vw] flex-col gap-6 md:max-w-screen-md">
            <DialogHeader className="text-left">
              <DialogTitle className="mb-2">Yakin buat tim baru?</DialogTitle>
              <DialogDescription>
                Kamu akan membuat 1 tim baru lagi yang akan mengikuti event ini.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2">
              <DialogClose>
                <Button variant="outline">Batalkan</Button>
              </DialogClose>
              <Button
                onClick={() =>
                  createTeamForEvent({
                    eventId: router.query.eventId as unknown as number,
                  })
                }
              >
                Tambah Tim
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {data?.map(({ id, EventTeamPlayer }) => {
        return (
          <TeamListItem
            key={id}
            id={id}
            teamPlayers={EventTeamPlayer}
            isOwner={isOwner}
            eventId={parseInt(router.query.eventId as string)}
          />
        );
      })}
    </div>
  );
};
