import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@bitsacco/common';
import { ChamasService } from './chamas.service';

/**
 * Configuration for Chama membership validation
 */
export interface ChamaMembershipConfig {
  /** Parameter or Query name containing the chama ID */
  chamaIdField: string;
}

/**
 * Set metadata for chama membership check
 */
export const CheckChamaMembership = (config: ChamaMembershipConfig) =>
  SetMetadata('chama_membership_check', config);

/**
 * A guard that restricts access to chama APIs based on user role:
 * - Admins and SuperAdmins can access all chamas
 * - Regular users can only access chamas where they are members
 */
@Injectable()
export class ChamaMemberGuard implements CanActivate {
  private readonly logger = new Logger(ChamaMemberGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly chamas: ChamasService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request to check if this is the filter endpoint
    const request = context.switchToHttp().getRequest();

    const chamaMembershipConfig = this.reflector.get<ChamaMembershipConfig>(
      'chama_membership_check',
      context.getHandler(),
    );

    if (!chamaMembershipConfig) {
      this.logger.debug('No chama membership config found, skipping guard');
      return true;
    }

    this.logger.debug(
      `Chama membership check metadata found: ${JSON.stringify(
        chamaMembershipConfig,
      )}`,
    );
    const user = request.user;

    if (!user) {
      this.logger.warn('Chama membership check failed: User not authenticated');
      throw new UnauthorizedException('User not authenticated');
    }

    // Admin users automatically bypass membership checks
    if (
      user.roles &&
      (user.roles.includes(Role.Admin) || user.roles.includes(Role.SuperAdmin))
    ) {
      this.logger.debug(
        `Admin/SuperAdmin access granted to chama for user ${user.id}`,
      );
      this.logger.debug(`REQUEST URL: ${request.url}`);
      return true;
    }

    const { chamaIdField } = chamaMembershipConfig;
    // Look for chamaId in params, body, and query
    const chamaId: string | undefined =
      (request.params && request.params[chamaIdField]) ||
      (request.query && request.query[chamaIdField]) ||
      (request.body && request.body[chamaIdField]);

    if (!chamaId) {
      this.logger.warn(
        `Chama ID field '${chamaIdField}' not found in request params, body, or query`,
      );
      return false;
    }

    try {
      // Get the chama to validate membership
      const chama = await this.chamas.findChama({ chamaId });

      // Check if user is a member of the chama
      const isMember = chama.members.some(
        (member) => member.userId === user.id,
      );

      if (!isMember) {
        this.logger.warn(
          `Chama membership check failed: User ${user.id} is not a member of chama ${chamaId}`,
        );
      } else {
        this.logger.debug(`User ${user.id} is a member of chama ${chamaId}`);
      }

      return isMember;
    } catch (error) {
      this.logger.error(
        `Error during chama membership check: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
