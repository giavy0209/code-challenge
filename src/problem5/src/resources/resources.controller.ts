/** @format */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from "@nestjs/common"
import { ResourcesService } from "./resources.service"
import { CreateResourceDto } from "./dto/create-resource.dto"
import { UpdateResourceDto } from "./dto/update-resource.dto"
import { QueryResourceDto } from "./dto/query-resource.dto"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("resources")
@Controller("resources")
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto)
  }

  @Get()
  findAll(@Query() query: QueryResourceDto) {
    return this.resourcesService.findAll(query)
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.resourcesService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateResourceDto: UpdateResourceDto) {
    return this.resourcesService.update(id, updateResourceDto)
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.resourcesService.remove(id)
  }
}
