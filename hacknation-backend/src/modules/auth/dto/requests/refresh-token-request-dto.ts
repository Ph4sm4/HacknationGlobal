import { IsNotEmpty, IsString } from 'class-validator';
import { AppRefreshToken } from 'src/modules/shared/types/ids';

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: AppRefreshToken;
}
