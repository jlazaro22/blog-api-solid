import { FastifyInstance } from 'fastify';
import { login } from 'http/controllers/v1/auth/login';
import { logout } from 'http/controllers/v1/auth/logout';
import { refreshToken } from 'http/controllers/v1/auth/refresh-token';
import { register } from 'http/controllers/v1/auth/register';
import { authenticate } from 'http/middlewares/authenticate';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/refresh-token', refreshToken);
  app.post('/logout', { onRequest: [authenticate] }, logout);
}
