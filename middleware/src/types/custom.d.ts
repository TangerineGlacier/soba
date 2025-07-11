import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | object; // Adjust the type based on your user data
  }
}
