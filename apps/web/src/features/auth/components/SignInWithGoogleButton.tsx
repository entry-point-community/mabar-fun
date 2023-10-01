import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '~/components/ui/button';

export const SignInWithGoogleButton = () => {
  const supabaseClient = useSupabaseClient();

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
