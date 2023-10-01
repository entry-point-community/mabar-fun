import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';

import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface SheetMenuProps {
  open: boolean;
  onOpenChange: (opened: boolean) => void;
}

export const SheetMenu: React.FC<SheetMenuProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader className="mb-8 h-10 text-left">
          <SheetTitle className="text-3xl font-bold">
            Mabar.<span className="text-primary">Fun</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100%-5rem)] flex-col justify-between">
          <ScrollArea>
            {/* TODO: Refactor this */}
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-2">
                <p className="mb-2 font-semibold">Gas Mabar</p>
                <Link className="text-muted-foreground" href="/">
                  Event Mabar{' '}
                  <Badge className="ml-2" variant="secondary">
                    🔴 Live
                  </Badge>
                </Link>
                <Link className="text-muted-foreground" href="/">
                  Creators
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <p className="mb-2 font-semibold">Tutorial (Coming Soon)</p>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t-2">
            <div className="my-2 flex items-center justify-between rounded-md p-4 hover:cursor-pointer hover:bg-gray-900">
              <div className="flex items-center gap-4 ">
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
              <ChevronRightIcon height={24} width={24} />
            </div>

            <Button
              variant="ghost"
              className="w-full font-semibold text-red-500 hover:bg-red-900 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
