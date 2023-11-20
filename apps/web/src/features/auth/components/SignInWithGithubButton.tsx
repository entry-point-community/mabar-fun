import { createBrowserClient } from '@supabase/ssr';
import { IoLogoGithub } from 'react-icons/io5';

import { Button } from '~/components/ui/button';
import { env } from '~/env.mjs';

export const SignInWithGithubButton = () => {
  const supabaseClient = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY,
  );

  const signInWithGithub = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: new URL(
          '/api/auth/callback',
          env.NEXT_PUBLIC_CLIENT_URL,
        ).toString(),
      },
    });
  };

  return (
    <Button onClick={signInWithGithub} size="lg" variant="github">
      <IoLogoGithub className="mr-2 h-6 w-6" />
      Masuk dengan Github
    </Button>
  );
};
