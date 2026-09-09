import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';
import { HOOK_METADATA } from '@/workless/events/hook.decorator';
import { HookPort } from '@/workless/interfaces/hook.interface';

type HookHandler = (payload: unknown) => Promise<unknown> | unknown;

@Injectable()
export class HookService implements HookPort {
  private readonly handlers = new Map<string, HookHandler[]>();
  private isScanned = false;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async emit<T>(hookName: string, payload: T): Promise<T> {
    this.ensureHandlersLoaded();

    let nextPayload = payload;
    for (const handler of this.handlers.get(hookName) ?? []) {
      const result = await handler(nextPayload);
      if (result !== undefined) {
        nextPayload = result as T;
      }
    }

    await this.eventEmitter.emitAsync(hookName, nextPayload);
    return nextPayload;
  }

  private ensureHandlersLoaded(): void {
    if (this.isScanned) {
      return;
    }

    for (const wrapper of this.discoveryService.getProviders()) {
      const instance = wrapper.instance;
      if (!instance || typeof instance !== 'object') {
        continue;
      }

      const prototype = Object.getPrototypeOf(instance);
      if (!prototype) {
        continue;
      }

      for (const methodName of this.metadataScanner.getAllMethodNames(prototype)) {
        const methodRef = prototype[methodName];
        const hookName = this.reflector.get<string | undefined>(HOOK_METADATA, methodRef);

        if (!hookName || typeof instance[methodName] !== 'function') {
          continue;
        }

        const existing = this.handlers.get(hookName) ?? [];
        existing.push(instance[methodName].bind(instance));
        this.handlers.set(hookName, existing);
      }
    }

    this.isScanned = true;
  }
}
