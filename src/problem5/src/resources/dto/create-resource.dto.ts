/** @format */

import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class CreateResourceDto {
  @ApiProperty({ example: "Resource Name" })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: "Resource Description", required: false })
  @IsOptional()
  @IsString()
  description?: string
}
