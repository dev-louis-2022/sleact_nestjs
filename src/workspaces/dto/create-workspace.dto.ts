import { PickType } from "@nestjs/swagger";
import { Workspace } from "../entities/workspace.entity";

export class CreateWorkspaceDto extends PickType(Workspace, [
  "url",
  "name",
  "ownerId",
] as const) {}
