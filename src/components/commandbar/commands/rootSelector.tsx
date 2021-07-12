import { History, ShowToaster } from '../CommandBar';
import { SelectorCommand } from '../command';
import { buildGoToPageSelector } from './goToPageSelector';
import { buildChangeApiUrlSelector } from './changeApiUrlSelector';
import { IAppConfigContext } from '../../hooks/useConfig';
import { buildToggleLocalizationAction } from './toggleLocalizatonAction';
import { buildBirdSelector } from './birdSelector';
import { buildMultiLevelSelector } from './multiLevelSelector';

const buildRootSelector = (
  history: History,
  configContext: IAppConfigContext,
  showToast: ShowToaster
): SelectorCommand => ({
  type: 'selector',
  title: '',
  key: 'root',
  label: '',
  placeHolder: 'Enter command...',
  options: () => [
    buildGoToPageSelector(history),
    buildChangeApiUrlSelector(configContext),
    buildToggleLocalizationAction(configContext),
    buildBirdSelector(showToast),
    buildMultiLevelSelector(showToast),
  ],
});

export { buildRootSelector };
