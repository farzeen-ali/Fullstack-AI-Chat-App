import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';

import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@Controller('ai')
@UseGuards(ThrottlerGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body() body: ChatRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.aiService.streamChat(body, res);
  }
}
