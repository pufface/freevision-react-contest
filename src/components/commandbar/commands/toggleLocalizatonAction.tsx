import { IAppConfigContext } from '../../hooks/useConfig';
import { ActionCommand } from '../engine/command';

const buildToggleLocalizationAction = (configContext: IAppConfigContext): ActionCommand => ({
  type: 'action',
  title: 'Toggle localization',
  key: 'toggleLocalization',
  action: () => {
    configContext.set('showLangKeys', !configContext.config.showLangKeys);
  },
});

export { buildToggleLocalizationAction };
