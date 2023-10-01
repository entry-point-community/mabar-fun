import Link from 'next/link';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { UserProfileCard } from './UserProfileCard';

interface SheetMenuProps {
  open: boolean;
  onOpenChange: (opened: boolean) => void;
}

export const SheetMenu: React.FC<SheetMenuProps> = ({ open, onOpenChange }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const logout = () => {
    supabaseClient.auth.signOut();
  };

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
            {user ? (
              <>
                {/* TODO: Refactor this to a separate component */}
                <UserProfileCard className="my-2 w-full" />

                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full font-semibold text-red-500 hover:bg-red-900 hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="my-2 w-full"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
