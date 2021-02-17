import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
