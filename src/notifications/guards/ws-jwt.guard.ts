import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { JwtPayload } from '../../auth/auth.types';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = extractToken(client);

    if (!token) {
      throw new WsException('Токен не найден');
    }

    try {
      const payload: JwtPayload = await this.jwtStrategy.validate(token);
      (client.data as { user?: JwtPayload }).user = payload;
      return true;
    } catch {
      throw new WsException('Невалидный или истёкший токен');
    }
  }
}

// токен передаётся при подключении: ws://host?token=jwtToken
export function extractToken(client: Socket): string | undefined {
  const token = client.handshake.query?.token;
  return Array.isArray(token) ? token[0] : token;
}
