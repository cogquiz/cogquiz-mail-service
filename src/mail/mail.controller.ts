import { Controller, Get, Post, Body, Query, HttpStatus, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { WinstonLoggerService } from '../common/logger.service';
import { Response } from 'express';

@Controller('mail-sent')
export class MailController {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly mailService: MailService,
  ) {}

  @Get('/check')
  async check(@Res() response: Response) {
    this.logger.info('Mail service health check');
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Mail service is running',
    });
  }

  @Post('/welcome')
  async sendWelcome(@Body('email') email: string, @Res() response: Response) {
    try {
      await this.mailService.sendWelcomeEmail(email);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Welcome email sent successfully',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Post('/forgot-password')
  async sendForgotPassword(@Body('email') email: string, @Res() response: Response) {
    try {
      await this.mailService.forgotPasswordEmail(email);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Forgot password email sent successfully',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Post('/new-password')
  async sendNewPassword(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    try {
      await this.mailService.sentNewPasswordToUser(email, password);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'New password email sent successfully',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
