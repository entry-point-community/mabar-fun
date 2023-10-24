import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useGetProfileQuery } from '@v6/api';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const AvatarDropdown = () => {
  const { data: profile } = useGetProfileQuery({});
  const supabaseClient = useSupabaseClient();

  const logout = () => {
    supabaseClient.auth.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="self-start">
        <Avatar className="h-9 w-9">
          <AvatarFallback>
            {profile?.data.displayName?.charAt(0)}
          </AvatarFallback>
          <AvatarImage src={profile?.data.profilePictureUrl || ''} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="font-semibold text-red-500"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
