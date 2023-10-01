import { useState } from 'react';
import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { Button } from '~/components/ui/button';
import { SheetMenu } from './SheetMenu';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

export const Header = () => {
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);

  const toggleSheetOpen = () => {
    setSheetOpened((prev) => !prev);
  };

  return (
    <>
      <div className="mb-10 flex p-6 lg:mb-20 lg:grid lg:grid-cols-3 lg:justify-center">
        <div className="col-start-2 hidden justify-center lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gas Mabar</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[400px] flex-col gap-4 p-4">
                    <Link href="/">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded p-1">
                <div className="flex items-center gap-4 px-2 text-left">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://cdn.discordapp.com/attachments/1050790741334569091/1157928772754997269/avatar.jpg" />
                  </Avatar>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground">
                      161432423 (1234)
                    </p>
                    <p className="truncate">mantra hujan</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem className="font-semibold text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
