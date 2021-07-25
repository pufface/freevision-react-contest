import { useState, useEffect, useMemo, useRef } from 'react';
import { SelectorCommand, Command, QuerySelectorCommand, SimpleSelectorCommand } from './command';
import { Result, LoadingResult, SuccessResult, ErrorResult } from '../../../utils/result';
import { includesIgnoreCase } from '../../../utils/stringUtils';

const QUERY_DEBOUNCE_WAIT_MS = 500;

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
  const isFirstFetchForCommand = useRef(true);

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
      ? { fetcher: simpleSelectorFetcher(command), debounceWait: 0 }
      : { fetcher: querySelectorFetcher(command), debounceWait: QUERY_DEBOUNCE_WAIT_MS };
  }, [command]);

  useEffect(() => {
    isFirstFetchForCommand.current = true;
  }, [command]);

  useEffect(() => {
    let cancelled = false;
    const timeout = isFirstFetchForCommand.current ? 0 : optionsFetcher.debounceWait;
    const timer = setTimeout(async () => {
      try {
        setResult(LoadingResult());
        const options = await optionsFetcher.fetcher(query);
        if (!cancelled) {
          setResult(SuccessResult(options));
        }
      } catch (e) {
        if (!cancelled) {
          setResult(ErrorResult('Error fetching'));
        }
      }
    }, timeout);
    isFirstFetchForCommand.current = false;

    return () => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [optionsFetcher, query]);

  return result;
};

export default useCommandFetcher;
export { emptyOptions };
export type { Options };
