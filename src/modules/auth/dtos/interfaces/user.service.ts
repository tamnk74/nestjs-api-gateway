import { Observable } from 'rxjs';
import { User } from '../responses';

export interface EmailInput {
  email: string;
}

export interface UserService {
  findOne(data: unknown): Observable<User>;
  findUserByEmail({ email }: EmailInput): Observable<User>;
}
