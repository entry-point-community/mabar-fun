import { User } from '@supabase/supabase-js';

export interface AuthUser extends Omit<User, 'id'> {
  sub: string;
}
