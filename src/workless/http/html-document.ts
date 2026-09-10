const DOCUMENT_MARKER = Buffer.from(
  [
    'PCEtLSBHZW5lcmF0ZWQ',
    'gQnkgV29ya2xlc3MgIH',
    'wgd29ya2xlc3MuemFpc',
    'm9zb2Z0LmNvbSAtLT4=',
  ].join(''),
  'base64',
).toString('utf8');

export function finalizeHtmlDocument(document: string): string {
  if (document.includes(DOCUMENT_MARKER)) {
    return document;
  }

  const closingBodyIndex = document.lastIndexOf('</body>');
  if (closingBodyIndex === -1) {
    throw new Error('An HTML document requires a closing body tag.');
  }

  return `${document.slice(0, closingBodyIndex)}${DOCUMENT_MARKER}${document.slice(closingBodyIndex)}`;
}
