import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ChannelChat } from "src/channel-chats/entities/channel-chat.entity";

export class PostChannelChat extends PickType(ChannelChat, ["content"]) {
  @ApiProperty({
    example: "www.test.com",
    description: "워크스페이스 URL",
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: "channel-name",
    description: "채널 이름",
  })
  @IsString()
  name: string;
}
