import { createBrowserClient } from '@supabase/ssr';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '~/components/ui/button';
import { env } from '~/env.mjs';

export const SignInWithGoogleButton = () => {
  const supabaseClient = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY,
  );

  const signInWithGoogle = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <Button onClick={signInWithGoogle} size="lg" variant="google">
      <FcGoogle className="mr-2 h-6 w-6" />
      Masuk dengan Google
    </Button>
  );
};
