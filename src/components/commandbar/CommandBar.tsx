import { useHistory } from 'react-router-dom';
import { Position, Toaster } from '@blueprintjs/core';
import { useConfig } from '../hooks/useConfig';
import CommandBarEngine from './CommandBarEngine';
import { buildRootSelector } from './commands/rootSelector';

type History = ReturnType<typeof useHistory>;
type ShowToaster = (text: string) => void;

const AppToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP,
});

const CommandBar = () => {
  const history = useHistory();
  const config = useConfig();
  const showToast: ShowToaster = (text) => AppToaster.show({ message: text });
  const root = buildRootSelector(history, config, showToast);
  console.log(config.config.showLangKeys);
  return <CommandBarEngine root={root} />;
};

export default CommandBar;
export type { History, ShowToaster };
