import { SelectorCommand } from '../command';
import goToPageSelector from './goToPageSelector';
import changeApiUrlSelector from './changeApiUrlSelector';
import toggleLocalizationAction from './toggleLocalizatonAction';
import birdSelector from './birdSelector';

const root: SelectorCommand = {
  type: 'selector',
  title: '',
  key: 'root',
  label: '',
  placeHolder: 'Enter command...',
  options: () => [goToPageSelector, changeApiUrlSelector, toggleLocalizationAction, birdSelector],
};

export default root;
