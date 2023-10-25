import { useRouter } from 'next/router';
import { useGetEventTeamsQuery } from '@v6/api';

export const TeamList = () => {
  const router = useRouter();

  const { data } = useGetEventTeamsQuery(
    parseInt(router.query.eventId as string),
    {
      enabled: router.isReady,
    },
  );

  return (
    <div className="mt-3 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">
        Teams terbentuk ({data?.length})
      </h3>
    </div>
  );
};
