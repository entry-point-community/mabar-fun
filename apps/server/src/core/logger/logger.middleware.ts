import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { SupabaseService } from '~/lib/supabase.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private supabaseService: SupabaseService) {}

  private readonly logger = new Logger('User Log');

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    let userEmail = req.body?.username || '';

    if (accessToken) {
      const { data } = await this.supabaseService
        .getClient()
        .auth.getUser(accessToken);

      userEmail = data.user?.email;
    }

    this.logger.log(
      `[${userEmail}] accessing ${req.method} "${req.originalUrl}"`,
    );

    if (next) {
      next();
    }
  }
}
