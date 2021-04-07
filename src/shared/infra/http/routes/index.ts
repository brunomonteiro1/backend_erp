import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes';
import sessionsRouter from '@modules/sessions/infra/http/routes';

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);

export default routes;
