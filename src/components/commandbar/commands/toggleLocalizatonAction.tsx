import { ActionCommand } from '../command';

const toggleLocalizationAction: ActionCommand = {
  type: 'action',
  title: 'Toggle localization',
  key: 'toggleLocalization',
  action: () => Promise.resolve().then(() => console.log('toggle')),
};

export default toggleLocalizationAction;
