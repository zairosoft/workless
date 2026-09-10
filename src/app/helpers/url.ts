/**
 * Builds an application URL from the URL environment variable.
 * Falls back to a relative path so local routing still works when URL is unset.
 */
export function url(path = ''): string {
  const baseUrl = process.env.URL?.trim().replace(/\/+$/, '');
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath || '/';
}
