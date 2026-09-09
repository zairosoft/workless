export interface HookPort {
  emit<T>(hookName: string, payload: T): Promise<T>;
}

export const HOOK_PORT = Symbol('HOOK_PORT');
