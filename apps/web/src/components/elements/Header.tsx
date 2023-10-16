import { useState } from 'react';
import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

import { Button } from '~/components/ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { SheetMenu } from './SheetMenu';
import { UserProfileCard } from './UserProfileCard';

export const Header = () => {
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);
  const supabaseClient = useSupabaseClient();

  const user = useUser();

  const logout = () => {
    supabaseClient.auth.signOut();
  };

  const toggleSheetOpen = () => {
    setSheetOpened((prev) => !prev);
  };

  return (
    <>
      <div className="mb-10 flex p-6 lg:grid lg:grid-cols-3 lg:justify-center">
        <div className="col-start-2 hidden justify-center lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gas Mabar</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[400px] flex-col gap-4 p-4">
                    <Link href="/events">
                      Event Mabar{' '}
                      <Badge className="ml-2" variant="secondary">
                        🔴 Live
                      </Badge>
                    </Link>
                    <Link href="/">Creators</Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger disabled>
                  Tutorial (Coming Soon)
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden justify-center lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <UserProfileCard />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          ) : (
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>

        <Button onClick={toggleSheetOpen} className="self-start lg:hidden">
          <HamburgerMenuIcon />
        </Button>
        <SheetMenu
          open={sheetOpened}
          onOpenChange={(opened) => setSheetOpened(opened)}
        />
      </div>
    </>
  );
};
