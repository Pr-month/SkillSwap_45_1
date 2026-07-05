import { UserRole } from '../users/enums/users.enums';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
