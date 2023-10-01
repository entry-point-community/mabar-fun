import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { IoLogoGithub } from 'react-icons/io5';

import { Button } from '~/components/ui/button';

export const SignInWithGithubButton = () => {
  const supabaseClient = useSupabaseClient();

  const signInWithGithub = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  return (
    <Button onClick={signInWithGithub} size="lg" variant="github">
      <IoLogoGithub className="mr-2 h-6 w-6" />
      Masuk dengan Github
    </Button>
  );
};
