import { NextApiHandler } from 'next';
import {
  createServerClient,
  serialize,
  type CookieOptions,
} from '@supabase/ssr';

import { env } from '~/env.mjs';

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  if (code) {
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        cookies: {
          get(name: string) {
            return req.cookies[name];
          },
          set(name: string, value: string, options: CookieOptions) {
            res.setHeader('Set-Cookie', serialize(name, value, options));
          },
          remove(name: string, options: CookieOptions) {
            res.setHeader('Set-Cookie', serialize(name, '', options));
          },
        },
      },
    );
    await supabase.auth.exchangeCodeForSession(String(code));
  }

  res.redirect('/');
};

export default handler;
