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

  const optionsFetcher = useMemo(() => {
    const getSimpleOptions = (selector: SimpleSelectorCommand<T>) => {
      const allOptions = selector.options();
      return (searchQuery: string) => {
        const filteredOptions = allOptions.filter(({ title }) => includesIgnoreCase(title, searchQuery));
        return {
          totalCount: filteredOptions.length,
          options: filteredOptions,
        };
      };
    };

    const fetchQueryOptions = (selector: QuerySelectorCommand<T>) => (searchQuery: string) =>
      selector.options(searchQuery);

    return command.type === 'simpleSelector' ? getSimpleOptions(command) : fetchQueryOptions(command);
  }, [command]);

  const setQueryOptimized = useMemo(() => {
    return command.type === 'simpleSelector' ? setQuery : debounce(setQuery, QUERY_DEBOUNCE_MS);
  }, [command.type]);

  useEffect(() => {
    Promise.resolve()
      .then(() => setResult(LoadingResult()))
      .then(() => optionsFetcher(query))
      .then((options) => setResult(SuccessResult(options)))
      .catch(() => setResult(ErrorResult('Error fetching')));
  }, [optionsFetcher, query]);

  return {
    result,
    setSearchQuery: setQueryOptimized,
  };
};

export default useCommandFetcher;
export type { Options };
