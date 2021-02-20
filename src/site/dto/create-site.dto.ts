import { IsNotEmpty, IsString, IsFQDN } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsFQDN()
  url: string;
}
