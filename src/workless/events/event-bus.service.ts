import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBusPort } from '@/workless/interfaces/event-bus.interface';

@Injectable()
export class EventBusService implements EventBusPort {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emit<T>(eventName: string, payload: T): Promise<void> {
    await this.eventEmitter.emitAsync(eventName, payload);
  }
}
