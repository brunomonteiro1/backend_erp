import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import fileConfig from '@config/upload';
import authMiddleware from '@shared/middlewares/authMiddleware';
import UserController from '../controllers/UsersController';
import ProfileController from '../controllers/ProfileController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const usersRouter = Router();
const upload = multer(fileConfig);

const usersController = new UserController();
const profileController = new ProfileController();
const passwordController = new ForgotPasswordController();
const resetController = new ResetPasswordController();

usersRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: { email: Joi.string().required() },
  }),
  passwordController.create
);

usersRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetController.create
);

usersRouter.use(authMiddleware);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      level: Joi.number().required(),
      status: Joi.boolean().required(),
    },
  }),
  usersController.create
);

usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      level: Joi.number().required(),
      status: Joi.boolean().required(),
    },
  }),
  usersController.update
);

usersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.show
);

usersRouter.get('/', usersController.index);

usersRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete
);

usersRouter.patch(
  '/avatar',
  upload.single('file'),
  usersController.updateAvatar
);

usersRouter.put(
  '/profile',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6),
      old_password: Joi.string().min(6),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update
);

export default usersRouter;
