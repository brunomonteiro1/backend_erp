import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import CreateSessionService from '@modules/users/services/CreateSessionsService';

export default class SessionController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSession = container.resolve(CreateSessionService);

    const { user, token } = await createSession.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
