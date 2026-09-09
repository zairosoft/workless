import { Inject, Injectable, Logger } from '@nestjs/common';
import { EVENT_BUS_PORT, EventBusPort } from '@/workless/interfaces/event-bus.interface';

@Injectable()
export class UsersEventsListener {
  private readonly logger = new Logger(UsersEventsListener.name);

  constructor(@Inject(EVENT_BUS_PORT) private readonly eventBus: EventBusPort) {}

  async emitDirectoryViewed(payload: Record<string, unknown>): Promise<void> {
    this.logger.debug(`platform user directory event=${JSON.stringify(payload)}`);
    await this.eventBus.emit('platform.user.directory.viewed', payload);
  }
}
