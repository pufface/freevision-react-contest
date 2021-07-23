import { useState, useEffect, useMemo } from 'react';
import { SelectorCommand, Command, QuerySelectorCommand, SimpleSelectorCommand } from './command';
import { Result, LoadingResult, SuccessResult, ErrorResult } from '../../../utils/result';
import { includesIgnoreCase } from '../../../utils/stringUtils';
import { debounce } from 'lodash';

const QUERY_DEBOUNCE_MS = 1000;

type Options<T> = {
  totalCount: number;
  options: Command<T>[];
};

const useCommandFetcher = <T,>(command: SelectorCommand<T>, initialQuery: string) => {
  const [result, setResult] = useState<Result<Options<T>, string>>(LoadingResult());
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchQueryOptions = (selector: QuerySelectorCommand<T>): Promise<Options<T>> => {
      return selector.options(query);
    };

    const getSimpleOptions = (selector: SimpleSelectorCommand<T>): Options<T> => {
      const options = selector.options().filter(({ title }) => includesIgnoreCase(title, query));
      return {
        totalCount: options.length,
        options,
      };
    };

    Promise.resolve()
      .then(() => setResult(LoadingResult()))
      .then(() => (command.type === 'simpleSelector' ? getSimpleOptions(command) : fetchQueryOptions(command)))
      .then((result) => setResult(SuccessResult(result)))
      .catch(() => setResult(ErrorResult('Error fetching')));
  }, [command, query]);

  const setQueryOptimized = useMemo(() => {
    return command.type === 'simpleSelector' ? setQuery : debounce(setQuery, QUERY_DEBOUNCE_MS);
  }, [command.type]);

  return {
    optionsResult: result,
    setOptionsQuery: setQueryOptimized,
  };
};

export default useCommandFetcher;
