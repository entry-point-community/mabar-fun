import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';

import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button, ButtonProps } from '../ui/button';

const UserProfileCard = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, forwardRef) => {
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
            <AvatarImage src={supabaseUser?.user_metadata.avatar_url} />
          </Avatar>
          <div className="flex flex-col justify-center">
            {/* TODO: use actual profile data */}
            <p className="text-sm text-muted-foreground">161432423 (1234)</p>
            <p className="truncate">mantra hujan</p>
          </div>
        </div>
      </Button>
    );
  },
);

UserProfileCard.displayName = 'UserProfileCard';

export { UserProfileCard };
