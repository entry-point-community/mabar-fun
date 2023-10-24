import Link from 'next/link';
import { PlusIcon } from '@radix-ui/react-icons';
import { IoBook, IoCalendar } from 'react-icons/io5';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const CreateDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="self-start" asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <PlusIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link className="flex justify-between" href="/event/create">
            Adain event
            <IoCalendar />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between" disabled>
          Bikin guide
          <IoBook />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
