// https://github.com/tc39/proposal-regex-escaping/blob/main/polyfill.js
const escapeRegExp = (text: string): string => text.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');

const createQueryRegExp = (query: string): RegExp => {
  const higliterExpRaw = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExp)
    .join('|');
  return RegExp(`(${higliterExpRaw})`, 'gi');
};

const includesIgnoreCase = (text: string, query: string): boolean => {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedText.indexOf(normalizedQuery) >= 0;
};

export { escapeRegExp, createQueryRegExp, includesIgnoreCase };
