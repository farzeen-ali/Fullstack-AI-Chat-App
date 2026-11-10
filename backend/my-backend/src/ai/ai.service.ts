import { createOpenAI } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText } from 'ai';
import type { Response } from 'express';

import { ChatRequestDto } from './dto/chat-request.dto';

@Injectable()
export class AiService {
  constructor(private readonly config: ConfigService) {}

  async streamChat(dto: ChatRequestDto, res: Response): Promise<void> {
    const apiKey = this.config.getOrThrow<string>('OPENAI_API_KEY');
    const modelId =
      this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    const openai = createOpenAI({ apiKey });
    const result = streamText({
      model: openai(modelId),
      messages: dto.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    result.pipeTextStreamToResponse(res);
  }
}
