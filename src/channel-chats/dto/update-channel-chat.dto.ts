import { PartialType } from '@nestjs/swagger';
import { CreateChannelChatDto } from './create-channel-chat.dto';

export class UpdateChannelChatDto extends PartialType(CreateChannelChatDto) {}
