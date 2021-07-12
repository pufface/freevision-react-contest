import { useState, useEffect } from 'react';
import { SelectorCommand, Command } from './command';
import { Result, buildLoadingResult, buildSuccessResult, buildErrorResult } from '../../../utils/result';

const useCommandEngine = <T,>(root: SelectorCommand<T>, context: T) => {
  const [current, setCurrent] = useState(root);
  const [history, setHistory] = useState<SelectorCommand<T>[]>([]);
  const [result, setResult] = useState<Result<Command<T>[], string>>(buildLoadingResult());

  useEffect(() => {
    setResult(buildLoadingResult());
    Promise.resolve(current.options(context))
      .then((options) => setResult(buildSuccessResult(options)))
      .catch(() => setResult(buildErrorResult('Error fetching')));
  }, [current, context]);

  const push = (command: SelectorCommand<T>): void => {
    setCurrent(command);
    setHistory([current, ...history]);
  };

  const pop = (): void => {
    const [first, ...rest] = history;
    if (!first) {
      return;
    }
    setCurrent(first);
    setHistory(rest);
  };

  const setRoot = (root: SelectorCommand<T>) => {
    setCurrent({ ...root });
    setHistory([]);
    setResult(buildLoadingResult());
  };

  return {
    command: current,
    commandResult: result,
    commandHistory: history,
    pushCommand: push,
    popCommand: pop,
    setRootCommand: setRoot,
  };
};

export default useCommandEngine;
