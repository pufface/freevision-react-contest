import { useMemo } from 'react';
import { createQueryRegExp } from '../utils/stringUtils';

type HighliterProps = {
  text: string;
  query: string;
};

const Highlighter: React.FC<HighliterProps> = ({ text, query }) => {
  const tokens = useMemo(() => {
    if (query.length === 0) {
      return text;
    }
    const highliterRegExp = createQueryRegExp(query);
    return text
      .split(highliterRegExp)
      .filter((token) => token.length > 0)
      .map((token, i) => (highliterRegExp.test(token) ? <strong key={i}>{token}</strong> : token));
  }, [text, query]);
  return <>{tokens}</>;
};

export default Highlighter;
