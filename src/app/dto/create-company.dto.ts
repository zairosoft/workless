import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CompanyTextDto {
  @IsString()
  @Matches(/^[a-z]{2}(?:-[a-z]{2})?$/i, {
    message: 'locale must be a locale such as en or th',
  })
  locale: string;

  @IsString()
  @MaxLength(160)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCompanyDto {
  @IsString()
  @MaxLength(160)
  name: string;

  @IsString()
  @MaxLength(80)
  @Matches(/^[a-z0-9][a-z0-9_-]*$/, {
    message: 'code must contain only lowercase letters, numbers, underscores, or hyphens',
  })
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyTextDto)
  texts?: CompanyTextDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
