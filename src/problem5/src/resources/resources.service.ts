/** @format */

import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateResourceDto } from "./dto/create-resource.dto"
import { UpdateResourceDto } from "./dto/update-resource.dto"
import { QueryResourceDto } from "./dto/query-resource.dto"
import { Prisma } from "@prisma/client"

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: createResourceDto,
    })
  }

  async findAll(query: QueryResourceDto) {
    const { search, sort, order, page = 1, limit = 10 } = query
    const skip = (page - 1) * limit

    const where: Prisma.ResourceWhereInput = {}

    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }]
    }

    const [total, items] = await Promise.all([
      this.prisma.resource.count({ where }),
      this.prisma.resource.findMany({
        where,
        orderBy: sort ? { [sort]: order || "asc" } : undefined,
        skip,
        take: limit,
      }),
    ])

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    })

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`)
    }

    return resource
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    try {
      return await this.prisma.resource.update({
        where: { id },
        data: updateResourceDto,
      })
    } catch (error) {
      throw new NotFoundException(`Resource with ID ${id} not found`)
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.resource.delete({
        where: { id },
      })
    } catch (error) {
      throw new NotFoundException(`Resource with ID ${id} not found`)
    }
  }
}
