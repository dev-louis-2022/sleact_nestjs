import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ChannelMember } from "src/entities/channel-member.entity";
import { WorkspaceMember } from "src/entities/workspace-member.entity";
import { User } from "../entities/user.entity";
import { UsersService } from "./users.service";

class MockUserRepository {}
class MockWorkspaceMemberRopository {}
class MockChannelMemberRepository {}

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMember),
          useClass: MockWorkspaceMemberRopository,
        },
        {
          provide: getRepositoryToken(ChannelMember),
          useClass: MockChannelMemberRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("findByEmail 이메일을 통해 유저 찾기", () => {
    expect(service.findByEmail("test@test.com")).toBe({
      email: "test@test.com",
      id: 1,
    });
  });

  it("findByEmail 이메일을 통해 유저 찾기 > 못 찾으면 null을 반환해야 함", () => {
    expect(service.findByEmail("testtttt@test.com")).toBe(null);
  });
});
