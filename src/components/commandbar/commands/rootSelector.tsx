import { CommandContext } from '../CommandBar';
import { SelectorCommand } from '../engine/command';
import goToPageSelector from './goToPageSelector';
import changeApiUrlSelector from './changeApiUrlSelector';
import toggleLocalizationAction from './toggleLocalizatonAction';
import birdSelector from './birdSelector';
import multiLevelSelector from './multiLevelSelector';

const rootSelector: SelectorCommand<CommandContext> = {
  type: 'simpleSelector',
  title: '',
  key: 'root',
  label: '',
  placeHolder: 'Enter command...',
  options: () => [goToPageSelector, changeApiUrlSelector, toggleLocalizationAction, birdSelector, multiLevelSelector],
};

export default rootSelector;
