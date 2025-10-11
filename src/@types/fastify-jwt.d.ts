import '@fastify/jwt';

import { IUser } from 'models/user';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: IUser['role'];
      sub: string;
    };
  }
}

export {};
