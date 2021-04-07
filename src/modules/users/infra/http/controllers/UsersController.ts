import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '../../../services/CreateUserService';
import UpdateUserService from '../../../services/UpdateUserService';
import DeleteUserService from '../../../services/DeleteUserService';
import ListUserService from '../../../services/ListUserService';
import ShowUserService from '../../../services/ShowUserService';
import UpdateAvatarUserService from '../../../services/UpdateUserAvatarService';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, level, status } = request.body;
    const user_id = request.user.id;
    const ip = request.socket.remoteAddress?.toString();
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      level,
      status,
      user_id,
      ip,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, email, password, level, status } = request.body;
    const user_id = request.user.id;
    const ip = request.socket.remoteAddress?.toString();
    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      email,
      password,
      level,
      status,
      user_id,
      ip,
    });

    return response.json(classToClass(user));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const ip = request.socket.remoteAddress?.toString();
    const indexUsers = container.resolve(ListUserService);

    const users = await indexUsers.execute({ user_id, ip });

    return response.json(classToClass(users));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { id } = request.params;
    const ip = request.socket.remoteAddress?.toString();
    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ id, user_id, ip });

    return response.json(classToClass(user));
  }


  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.body.id;
    const user_id = request.user.id;
    const ip = request.socket.remoteAddress?.toString();
    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({ id, user_id, ip });

    return response.json({ ok: true });
  }

  public async updateAvatar(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.body;
    const user_id = request.user.id;
    const ip = request.socket.remoteAddress?.toString();
    const { filename } = request.file;
    const uploadAvatar = container.resolve(UpdateAvatarUserService);

    const avatar = await uploadAvatar.execute({ id, filename, user_id, ip });

    return response.json(classToClass(avatar));
  }
}
