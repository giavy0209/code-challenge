/** @format */

import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional } from "class-validator"

export class UpdateResourceDto {
  @ApiProperty({ example: "Updated Resource Name", required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: "Updated Resource Description", required: false })
  @IsOptional()
  @IsString()
  description?: string
}
