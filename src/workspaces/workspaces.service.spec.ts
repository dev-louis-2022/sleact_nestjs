import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Workspace } from "../entities/workspace.entity";
import { WorkspacesService } from "./workspaces.service";

class MockUserRepository {}
class MockWorkspaceRopository {}

describe("WorkspacesService", () => {
  let service: WorkspacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(Workspace),
          useClass: MockWorkspaceRopository,
        },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
