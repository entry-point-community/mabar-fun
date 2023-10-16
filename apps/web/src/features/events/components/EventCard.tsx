import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

interface EventCardProps {
  title: string;
  description: string;
  displayName: string;
  username: string;
  profilePictureUrl: string;
  playersJoined: number;
  totalMatches: number;
  id: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  displayName,
  playersJoined,
  profilePictureUrl,
  title,
  totalMatches,
  username,
  id,
}) => {
  return (
    <Link
      href={`/events/${id}`}
      className="flex gap-3 md:rounded md:border md:p-4"
    >
      <div className="col-span-2 flex max-w-[6rem] flex-col justify-center gap-2">
        <Avatar className="h-24 w-24 rounded-md">
          <AvatarFallback className="rounded-md">
            {displayName.charAt(0)}
          </AvatarFallback>
          <AvatarImage src={profilePictureUrl} />
        </Avatar>
        <p className="text-center text-xs">
          {displayName} {username}
        </p>
      </div>

      <div className="col-span-5 flex flex-1 flex-col gap-1">
        <p className="text-md line-clamp-3 font-semibold md:text-xl">{title}</p>
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <p>{totalMatches} Total matches</p>
          <p>{playersJoined} Players joined</p>
        </div>
      </div>
    </Link>
  );
};
