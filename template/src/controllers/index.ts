import { container } from './container';

import { UserController } from './user.controller';

export const userController = container.get(UserController);
