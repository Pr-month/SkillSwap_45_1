import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { JwtPayload } from '../../auth/auth.types';

// В вебсокетах стандартные CanActivate-гарды работают плохо (срабатывают на
// сообщения, а не на само подключение), поэтому вместо гарды используем класс
// с методом verify, который проверяет токен при подключении.
@Injectable()
export class WsJwtGuard {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  // Проверяет токен и возвращает пейлоуд, либо бросает WsException
  async verify(token: string | undefined): Promise<JwtPayload> {
    if (!token) {
      throw new WsException('Токен не найден');
    }

    try {
      return await this.jwtStrategy.validate(token);
    } catch {
      throw new WsException('Невалидный или истёкший токен');
    }
  }

  // Токен передаётся при подключении: ws://host?token=jwtToken
  extractToken(client: Socket): string | undefined {
    const token = client.handshake.query?.token;
    return Array.isArray(token) ? token[0] : token;
  }
}
