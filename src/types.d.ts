// Type definitions for Express extensions
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
      platformId: number;
      platform: string;
    };
  }
}

