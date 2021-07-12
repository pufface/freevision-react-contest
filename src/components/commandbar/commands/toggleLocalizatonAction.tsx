import { IAppConfigContext } from '../../hooks/useConfig';
import { ActionCommand } from '../command';

const buildToggleLocalizationAction = (configContext: IAppConfigContext): ActionCommand => ({
  type: 'action',
  title: 'Toggle localization',
  key: 'toggleLocalization',
  action: () => {
    console.log(configContext.config.showLangKeys);
    configContext.set('showLangKeys', !configContext.config.showLangKeys);
  },
});

export { buildToggleLocalizationAction };
