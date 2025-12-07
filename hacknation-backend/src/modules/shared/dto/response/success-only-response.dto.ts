import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SuccessOnlyResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}
