/** @format */

import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsInt, Min, IsIn } from "class-validator"
import { Type } from "class-transformer"

export class QueryResourceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({ required: false, enum: ["name", "createdAt"] })
  @IsOptional()
  @IsString()
  @IsIn(["name", "createdAt"])
  sort?: string

  @ApiProperty({ required: false, enum: ["asc", "desc"] })
  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc"

  @ApiProperty({ required: false, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiProperty({ required: false, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
