/** @format */

import { Module } from "@nestjs/common"
import { ResourcesModule } from "./resources/resources.module"

@Module({
  imports: [ResourcesModule],
})
export class AppModule {}
