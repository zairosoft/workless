const DOCUMENT_MARKER = Buffer.from(
  [
    'PCEtLSBHZW5lcmF0ZWQg',
    'QnkgWm9sYXdvcmsgfCB6',
    'b2xhd29yay5jb20gLS0+',
  ].join(''),
  'base64',
).toString('utf8');

export function finalizeHtmlDocument(document: string): string {
  if (document.includes(DOCUMENT_MARKER)) {
    return document;
  }

  const closingHtmlTag = '</html>';
  const closingHtmlIndex = document.lastIndexOf(closingHtmlTag);
  if (closingHtmlIndex === -1) {
    throw new Error('An HTML document requires a closing html tag.');
  }

  const insertionIndex = closingHtmlIndex + closingHtmlTag.length;
  return `${document.slice(0, insertionIndex)}${DOCUMENT_MARKER}${document.slice(insertionIndex)}`;
}
