import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  NotificationTopic,
  UsersDocument,
  ResourceOwnerGuard,
  CheckOwnership,
} from '@bitsacco/common';
import {
  GetNotificationsResponseDto,
  MarkAsReadDto,
  MarkAsReadResponseDto,
  UpdatePreferencesDto,
  UpdatePreferencesResponseDto,
} from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(ResourceOwnerGuard)
  @CheckOwnership({ paramName: 'userId', idField: 'id' })
  @ApiOperation({
    summary: 'Get user notifications with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated user notifications',
    type: GetNotificationsResponseDto,
  })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({
    name: 'topics',
    required: false,
    type: [Number],
    isArray: true,
    enum: NotificationTopic,
    description:
      'Filter by topics (0=TRANSACTION, 1=SECURITY, 2=SYSTEM, 3=SWAP, 4=SHARES, 5=CHAMA)',
  })
  async getNotifications(
    @CurrentUser() user: UsersDocument,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('topics') topics?: NotificationTopic[],
  ): Promise<GetNotificationsResponseDto> {
    try {
      const pagination = {
        page: page !== undefined ? Number(page) : 0,
        size: size !== undefined ? Number(size) : 10,
      };

      // Convert topics to array of numbers if provided
      const topicsArray = topics
        ? Array.isArray(topics)
          ? topics.map((t) => Number(t))
          : [Number(topics)]
        : [];

      const response = await this.notificationService.getNotifications(
        user._id,
        unreadOnly === 'true',
        pagination,
        topicsArray,
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching notifications: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  @Post('read')
  @UseGuards(ResourceOwnerGuard)
  @CheckOwnership({ paramName: 'userId', idField: 'id' })
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'Notifications marked as read successfully',
    type: MarkAsReadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async markAsRead(
    @CurrentUser() user: UsersDocument,
    @Body() body: MarkAsReadDto,
  ): Promise<MarkAsReadResponseDto> {
    try {
      await this.notificationService.markAsRead(
        user._id,
        body.notificationIds || [],
      );

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error marking notifications as read: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        error.message || 'Failed to mark notifications as read',
      );
    }
  }

  @Get('preferences')
  @UseGuards(ResourceOwnerGuard)
  @CheckOwnership({ paramName: 'userId', idField: 'id' })
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({
    status: 200,
    description: 'Returns user notification preferences',
  })
  async getPreferences(@CurrentUser() user: UsersDocument) {
    try {
      const response = await this.notificationService.getPreferences(user._id);

      return response;
    } catch (error) {
      this.logger.error(
        `Error fetching notification preferences: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch notification preferences',
      );
    }
  }

  @Put('preferences')
  @UseGuards(ResourceOwnerGuard)
  @CheckOwnership({ paramName: 'userId', idField: 'id' })
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
    type: UpdatePreferencesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updatePreferences(
    @CurrentUser() user: UsersDocument,
    @Body() body: UpdatePreferencesDto,
  ): Promise<UpdatePreferencesResponseDto> {
    try {
      await this.notificationService.updatePreferences(
        user._id,
        body.channels || [],
        body.topics || [],
      );

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error updating notification preferences: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        error.message || 'Failed to update notification preferences',
      );
    }
  }
}
