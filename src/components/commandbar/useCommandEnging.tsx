import { useState, useEffect, useMemo } from 'react';
import { SelectorCommand, Command } from './command';
import { Result, buildLoadingResult, buildSuccessResult, buildErrorResult } from '../../utils/result';

const useCommandEngine = (root: SelectorCommand) => {
  const [current, setCurrent] = useState(root);
  const [history, setHistory] = useState<SelectorCommand[]>([]);
  const [result, setResult] = useState<Result<Command[], string>>(buildLoadingResult());

  useEffect(() => {
    setResult(buildLoadingResult());
    Promise.resolve(current.options())
      .then((options) => {
        setResult(buildSuccessResult(options));
      })
      .catch((error) => {
        console.error(error);
        setResult(buildErrorResult('Error fetching'));
      });
  }, [current, setResult]);

  return useMemo(() => {
    const push = (command: SelectorCommand): void => {
      setCurrent(command);
      setHistory([current, ...history]);
    };
    const pop = (): SelectorCommand | undefined => {
      const [first, ...rest] = history;
      if (!first) {
        return;
      }
      setCurrent(first);
      setHistory(rest);
      return first;
    };
    return {
      command: current,
      commandResult: result,
      commandHistory: history,
      pushCommand: push,
      popCommand: pop,
    };
  }, [current, history, result]);
};

export default useCommandEngine;
