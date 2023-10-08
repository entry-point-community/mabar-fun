import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useGetProfileQuery } from '@v6/api';

import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button, ButtonProps } from '../ui/button';

const UserProfileCard = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, forwardRef) => {
    const { data: profile } = useGetProfileQuery({});
    const supabaseUser = useUser();

    return (
      <Button
        size="icon"
        variant="ghost"
        className={cn(`justify-start rounded p-1`, className)}
        {...props}
        ref={forwardRef}
      >
        <div className="flex items-center gap-4 px-2 text-left">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{supabaseUser?.email?.charAt(0)}</AvatarFallback>
            <AvatarImage src={profile?.data.profilePictureUrl || ''} />
          </Avatar>
          <div className="flex flex-col justify-center">
            <p className="text-sm text-muted-foreground">
              {profile?.data.mlbbUserId} ({profile?.data.mlbbServerId})
            </p>
            <p className="truncate">{profile?.data.mlbbUsername}</p>
          </div>
        </div>
      </Button>
    );
  },
);

UserProfileCard.displayName = 'UserProfileCard';

export { UserProfileCard };
