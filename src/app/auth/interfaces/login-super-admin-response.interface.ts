import { User } from './user.interface';

export interface LoginSuperAdminResponse {
  superAdmin:  User;
  token: string;
}

