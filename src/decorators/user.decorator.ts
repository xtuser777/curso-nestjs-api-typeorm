import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      if (key) {
        return request.user[key];
      } else {
        return request.user;
      }
    } else {
      throw new NotFoundException('Usuário não encontrado na requisição.');
    }
  },
);
