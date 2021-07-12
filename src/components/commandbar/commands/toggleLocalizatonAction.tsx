import { CommandContext } from '../CommandBar';
import { ActionCommand } from '../engine/command';

const toggleLocalizationAction: ActionCommand<CommandContext> = {
  type: 'action',
  title: 'Toggle localization',
  key: 'toggleLocalization',
  action: ({ config }) => {
    config.set('showLangKeys', !config.config.showLangKeys);
  },
};

export default toggleLocalizationAction;
