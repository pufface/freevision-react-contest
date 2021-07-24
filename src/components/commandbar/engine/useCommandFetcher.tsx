import { useState, useEffect, useMemo } from 'react';
import { SelectorCommand, Command, QuerySelectorCommand, SimpleSelectorCommand } from './command';
import { Result, LoadingResult, SuccessResult, ErrorResult } from '../../../utils/result';
import { includesIgnoreCase } from '../../../utils/stringUtils';
import debounce from 'debounce-promise';

const DEBOUNCE_WAIT_MS = 200;

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

  const optionsFetcher = useMemo(() => {
    const simpleSelectorFetcher = (command: SimpleSelectorCommand<T>) => {
      const allOptions = command.options();
      return (query: string) => {
        const filteredOptions = allOptions.filter(({ title }) => includesIgnoreCase(title, query));
        return {
          totalCount: filteredOptions.length,
          options: filteredOptions,
        };
      };
    };
    const querySelectorFetcher = (command: QuerySelectorCommand<T>) => {
      return (query: string) => command.options(query);
    };
    return command.type === 'simpleSelector'
      ? simpleSelectorFetcher(command)
      : debounce(querySelectorFetcher(command), DEBOUNCE_WAIT_MS, { leading: true });
  }, [command]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => setResult(LoadingResult()))
      .then(() => optionsFetcher(query))
      .then((options) => {
        if (!cancelled) {
          setResult(SuccessResult(options));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult(ErrorResult('Error fetching'));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [optionsFetcher, query]);

  return result;
};

export default useCommandFetcher;
export { emptyOptions };
export type { Options };
