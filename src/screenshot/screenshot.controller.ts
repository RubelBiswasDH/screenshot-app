import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { env } from '../env.config';
import { ScreenshotService } from './screenshot.service';

@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}
  @Get('')
  async captureScreenshot(
    @Res() res: Response,
    @Query('url') url: string,
    @Headers('x-key') apiKey?: string,
  ) {
    if (!apiKey || apiKey !== env.EXTERNAL_KEY) {
      throw new UnauthorizedException(
        'Unauthorized - Invalid or missing API key',
      );
    }
    return await this.screenshotService.getScreenshot(res, url);
  }

  @Get('run-status')
  async getRunStatus() {
    return await this.screenshotService.getRunStatus();
  }
  @Cron(CronExpression.EVERY_10_MINUTES, {
    timeZone: 'Asia/Dhaka',
  })
  async checkIdleTime() {
    await this.screenshotService.checkIdleTime();
  }
}
