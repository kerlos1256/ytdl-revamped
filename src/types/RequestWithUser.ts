import { Request } from 'express';

export interface ReqWithUser extends Request {
  user: {
    id: number;
    username: string;
  };
}
