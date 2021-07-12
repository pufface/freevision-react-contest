import { useState, useEffect } from 'react';
import { SelectorCommand, Command } from './command';
import { Result, buildLoadingResult, buildSuccessResult, buildErrorResult } from '../../../utils/result';

const useCommandEngine = (root: SelectorCommand) => {
  const [current, setCurrent] = useState(root);
  const [history, setHistory] = useState<SelectorCommand[]>([]);
  const [result, setResult] = useState<Result<Command[], string>>(buildLoadingResult());

  useEffect(() => {
    setResult(buildLoadingResult());
    Promise.resolve(current.options())
      .then((options) => setResult(buildSuccessResult(options)))
      .catch(() => setResult(buildErrorResult('Error fetching')));
  }, [current]);

  const push = (command: SelectorCommand): void => {
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

  const setRoot = (root: SelectorCommand) => {
    setCurrent(root);
    setHistory([]);
    setResult(buildLoadingResult);
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
