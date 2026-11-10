import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @IsIn(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @IsString()
  @IsNotEmpty()
  @MaxLength(32000)
  content: string;
}
