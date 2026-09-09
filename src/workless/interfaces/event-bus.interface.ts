export interface EventBusPort {
  emit<T>(eventName: string, payload: T): Promise<void>;
}

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');
