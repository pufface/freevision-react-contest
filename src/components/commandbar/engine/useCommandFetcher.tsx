import { useState, useEffect, useMemo } from 'react';
import { SelectorCommand, Command, QuerySelectorCommand, SimpleSelectorCommand } from './command';
import { Result, LoadingResult, SuccessResult, ErrorResult } from '../../../utils/result';
import { includesIgnoreCase } from '../../../utils/stringUtils';
import { debounce } from 'lodash';

const DEBOUNCE_WAIT_MS = 250;

type Options<T> = {
  totalCount: number;
  options: Command<T>[];
};

const emptyOptions = <T,>(): Options<T> => ({
  totalCount: 0,
  options: [],
});

const useCommandFetcher = <T,>(command: SelectorCommand<T>, query: string) => {
  const [result, setResult] = useState<Result<Options<T>, string>>(LoadingResult());

  const fetchQueryOptions = useMemo(() => {
    return (selector: QuerySelectorCommand<T>, searchQuery: string) => {
      Promise.resolve()
        .then(() => setResult(LoadingResult()))
        .then(() => selector.options(searchQuery))
        .then((options) => setResult(SuccessResult(options)))
        .catch(() => setResult(ErrorResult('Error fetching')));
    };
  }, []);

  const fetchQueryOptionsDebounced = useMemo(() => {
    return debounce(fetchQueryOptions, DEBOUNCE_WAIT_MS);
  }, [fetchQueryOptions]);

  const getSimpleOptions = useMemo(() => {
    return (selector: SimpleSelectorCommand<T>, searchQuery: string) => {
      const allOptions = selector.options();
      const filteredOptions = allOptions.filter(({ title }) => includesIgnoreCase(title, searchQuery));
      const options = {
        totalCount: filteredOptions.length,
        options: filteredOptions,
      };
      setResult(SuccessResult(options));
    };
  }, []);

  useEffect(() => {
    if (command.type === 'simpleSelector') {
      getSimpleOptions(command, query);
    } else if (query === '') {
      fetchQueryOptions(command, query);
    } else {
      fetchQueryOptionsDebounced(command, query);
    }
  }, [command, query, getSimpleOptions, fetchQueryOptions, fetchQueryOptionsDebounced]);

  return result;
};

export default useCommandFetcher;
export { emptyOptions };
export type { Options };
