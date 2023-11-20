import {
  CookieOptions,
  createBrowserClient,
  createServerClient,
  serialize,
} from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

import { env } from '../env';

export const supabaseClient: SupabaseClient = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_KEY,
);

export const supabaseServerClient = (context: any) => {
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.appendHeader(
            'Set-Cookie',
            serialize(name, value, options),
          );
        },
        remove(name: string, options: CookieOptions) {
          context.res.appendHeader('Set-Cookie', serialize(name, '', options));
        },
      },
    },
  );
};
