import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Position, Toaster } from '@blueprintjs/core';
import { IAppConfigContext, useConfig } from '../hooks/useConfig';
import CommandBarEngine from './engine/CommandBarEngine';
import rootSelector from './commands/rootSelector';

type CommandContext = {
  history: ReturnType<typeof useHistory>;
  config: IAppConfigContext;
  showToast: (text: string) => void;
};

const AppToaster = Toaster.create({
  position: Position.TOP,
});

const CommandBar = () => {
  const history = useHistory();
  const config = useConfig();
  const context = useMemo(() => {
    const showToast = (text: string) => AppToaster.show({ message: text });
    return { history, config, showToast };
  }, [history, config]);

  return <CommandBarEngine rootCommand={rootSelector} context={context} />;
};

export default CommandBar;
export type { CommandContext };
