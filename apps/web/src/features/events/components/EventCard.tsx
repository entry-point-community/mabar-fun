import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

interface EventCardProps {
  title: string;
  description: string;
  displayName: string;
  username: string;
  profilePictureUrl: string;
  playersJoined: number;
  totalMatches: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  description,
  displayName,
  playersJoined,
  profilePictureUrl,
  title,
  totalMatches,
  username,
}) => {
  return (
    <div className="flex flex-col gap-3 md:rounded md:border md:p-4">
      <div className="col-span-2 flex items-center gap-4">
        <Avatar className="h-14 w-14 sm:h-20 sm:w-20">
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          <AvatarImage src={profilePictureUrl} />
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground">{username}</p>
        </div>
      </div>

      <div className="col-span-5 flex flex-col gap-1">
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 grid grid-cols-2 rounded border py-2">
          <div className="flex flex-col items-center border-r">
            <p className="text-2xl">{playersJoined}</p>
            <p className="text-sm text-muted-foreground">Players Joined</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl">{totalMatches}</p>
            <p className="text-sm text-muted-foreground">Total Match</p>
          </div>
        </div>
        <Button className="mt-2">Daftar event</Button>
      </div>
    </div>
  );
};
