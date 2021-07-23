import { useState, useMemo } from 'react';
import { SelectorCommand } from './command';

const useCommandHistory = <T,>(root: SelectorCommand<T>) => {
  const [current, setCurrent] = useState(root);
  const [history, setHistory] = useState<SelectorCommand<T>[]>([]);

  return useMemo(() => {
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

    const reset = () => {
      setCurrent({ ...root });
      setHistory([]);
    };

    return {
      currentCommand: current,
      historicCommands: history,
      pushCommand: push,
      popCommand: pop,
      resetHistory: reset,
    };
  }, [current, history, root]);
};

export default useCommandHistory;
