import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Request } from 'express';

export type AppLocale = string;
export type ModuleLocaleName = string;
export const LOCALE_COOKIE_NAME = 'locale';

interface MessageTree {
  [key: string]: string | MessageTree;
}

function loadJsonFile(filePath: string): MessageTree | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as MessageTree;
}

function isObject(value: unknown): value is MessageTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(target: MessageTree, source: MessageTree): MessageTree {
  const output: MessageTree = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const current = output[key];

    if (isObject(current) && isObject(value)) {
      output[key] = deepMerge(current, value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

function loadLocaleDirectory(localeRoot: string): MessageTree | null {
  if (!fs.existsSync(localeRoot)) {
    return null;
  }

  const files = fs
    .readdirSync(localeRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  if (files.length === 0) {
    return null;
  }

  return files.reduce<MessageTree>((acc, fileName) => {
    const messages = loadJsonFile(path.join(localeRoot, fileName));

    if (!messages) {
      return acc;
    }

    return deepMerge(acc, messages);
  }, {});
}

function loadAppLocales(): Record<AppLocale, MessageTree> {
  const localesRoot = path.resolve(__dirname, './locales');

  if (!fs.existsSync(localesRoot)) {
    return {};
  }

  return fs.readdirSync(localesRoot, { withFileTypes: true }).reduce<Record<AppLocale, MessageTree>>(
    (acc, entry) => {
      if (!entry.isDirectory()) {
        return acc;
      }

      const messages = loadLocaleDirectory(path.join(localesRoot, entry.name));

      if (messages) {
        acc[entry.name] = messages;
      }

      return acc;
    },
    {},
  );
}

function loadModuleLocales(): Record<ModuleLocaleName, Record<AppLocale, MessageTree>> {
  const modulesRoot = path.resolve(__dirname, '../modules');

  if (!fs.existsSync(modulesRoot)) {
    return {};
  }

  return fs.readdirSync(modulesRoot, { withFileTypes: true }).reduce<
    Record<ModuleLocaleName, Record<AppLocale, MessageTree>>
  >((acc, entry) => {
    if (!entry.isDirectory()) {
      return acc;
    }

    const localesRoot = path.join(modulesRoot, entry.name, 'locales');

    if (!fs.existsSync(localesRoot)) {
      return acc;
    }

    const locales = fs.readdirSync(localesRoot, { withFileTypes: true }).reduce<
      Record<AppLocale, MessageTree>
    >((localeAcc, localeEntry) => {
      if (!localeEntry.isDirectory()) {
        return localeAcc;
      }

      const messages = loadLocaleDirectory(path.join(localesRoot, localeEntry.name));

      if (messages) {
        localeAcc[localeEntry.name] = messages;
      }

      return localeAcc;
    }, {});

    if (Object.keys(locales).length > 0) {
      acc[entry.name] = locales;
    }

    return acc;
  }, {});
}

const appLocales = loadAppLocales();
const moduleLocales = loadModuleLocales();
const defaultLocale = 'en';

export const supportedLocales = Object.freeze(
  Object.keys(appLocales).sort(),
) as readonly AppLocale[];

function getByPath(messages: MessageTree, key: string): string | undefined {
  const parts = key.split('.');
  let current: string | MessageTree | undefined = messages;

  for (const part of parts) {
    if (!isObject(current)) {
      return undefined;
    }

    current = current[part];
  }

  return typeof current === 'string' ? current : undefined;
}

function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValueParts] = part.trim().split('=');

    if (!rawKey || rawValueParts.length === 0) {
      return acc;
    }

    acc[rawKey] = decodeURIComponent(rawValueParts.join('='));
    return acc;
  }, {});
}

export function resolveLocale(input?: string | null): AppLocale {
  if (!input) {
    return defaultLocale;
  }

  const normalized = input.toLowerCase().trim();
  const exact = supportedLocales.find((locale) => locale === normalized);
  if (exact) {
    return exact;
  }

  const language = normalized.split(/[-_,;]/)[0];
  const partial = supportedLocales.find((locale) => locale === language);
  return partial ?? defaultLocale;
}

export function resolveLocaleFromRequest(request: Pick<Request, 'headers'>): AppLocale {
  const cookieHeader =
    typeof request.headers.cookie === 'string' ? request.headers.cookie : undefined;
  const localeCookie = parseCookieHeader(cookieHeader)[LOCALE_COOKIE_NAME];

  if (localeCookie) {
    return resolveLocale(localeCookie);
  }

  const headerLang =
    typeof request.headers['x-lang'] === 'string'
      ? request.headers['x-lang']
      : typeof request.headers['accept-language'] === 'string'
        ? request.headers['accept-language']
        : undefined;

  return resolveLocale(headerLang);
}

export function createTranslator(
  locale: AppLocale,
  options: { modules?: ModuleLocaleName[] } = {},
) {
  let messages = appLocales[defaultLocale] ?? {};

  if (locale !== defaultLocale && appLocales[locale]) {
    messages = deepMerge(messages, appLocales[locale]);
  }

  for (const moduleName of options.modules ?? []) {
    const moduleRegistry = moduleLocales[moduleName];

    if (!moduleRegistry) {
      continue;
    }

    if (moduleRegistry[defaultLocale]) {
      messages = deepMerge(messages, moduleRegistry[defaultLocale]);
    }

    if (locale !== defaultLocale && moduleRegistry[locale]) {
      messages = deepMerge(messages, moduleRegistry[locale]);
    }
  }

  return {
    locale,
    t(key: string): string {
      return getByPath(messages, key) ?? key;
    },
  };
}
