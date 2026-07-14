import { Request } from 'express';
import { UserRole } from '../users/enums/users.enums';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export interface AuthRequest extends Request {
  user: JwtPayload;
}

export interface RefreshTokenUser {
  sub: string;
  email: string;
  role: string;
  refreshToken: string;
}

export interface RequestWithUser extends Request {
  user: RefreshTokenUser;
}
