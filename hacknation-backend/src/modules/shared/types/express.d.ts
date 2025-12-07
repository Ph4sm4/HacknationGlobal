import { UserDetails } from 'src/modules/auth/types/types';

declare global {
  namespace Express {
    interface User extends UserDetails {}
  }
}
