import { GuestRoute } from '~/components/guards/GuestRoute';
import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { Separator } from '~/components/ui/separator';
import {
  SignInWithGithubButton,
  SignInWithGoogleButton,
} from '~/features/auth/components';

const LoginPage = () => {
  return (
    <GuestRoute>
      <HeadMetaData title="Sign In" />
      <main className="container min-h-screen max-w-lg">
        <div className="flex flex-col gap-12 rounded border p-8">
          <h1 className="text-center font-heading text-3xl font-semibold">
            Login sekarang 🎮
          </h1>

          <div className="flex flex-col">
            <SignInWithGithubButton />
            <div className="my-3 flex items-center">
              <Separator className="mx-8 flex-1" /> Atau{' '}
              <Separator className="mx-8 flex-1" />
            </div>
            <SignInWithGoogleButton />
          </div>
        </div>
      </main>
    </GuestRoute>
  );
};

export default LoginPage;
