import { useState } from 'react';
import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { Button } from '~/components/ui/button';
import { Badge } from '../ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { AvatarDropdown } from './AvatarDropdown';
import { CreateDropdown } from './CreateDropdown';
import { SheetMenu } from './SheetMenu';

export const Header = () => {
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);

  const toggleSheetOpen = () => {
    setSheetOpened((prev) => !prev);
  };

  return (
    <>
      <div className="mb-10 flex justify-between p-6 lg:grid lg:grid-cols-3 lg:justify-center">
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

        <Button
          onClick={toggleSheetOpen}
          className="rounded-full lg:hidden"
          variant="ghost"
          size="icon"
        >
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>

        <div className="flex justify-end gap-4 md:gap-6">
          <CreateDropdown />
          <AvatarDropdown />
        </div>

        <SheetMenu
          open={sheetOpened}
          onOpenChange={(opened) => setSheetOpened(opened)}
        />
      </div>
    </>
  );
};
