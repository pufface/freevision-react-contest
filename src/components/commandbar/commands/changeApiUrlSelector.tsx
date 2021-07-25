import { ActionCommand, SelectorCommand } from '../engine/command';
import { CommandContext } from '../CommandBar';

const buildAction = (title: string, url?: string): ActionCommand<CommandContext> => ({
  type: 'action',
  title,
  label: url,
  key: title,
  action({ config }) {
    if (url) {
      config.set('apiUrl', url);
    } else {
      config.reset('apiUrl');
    }
  },
});
const changeApiUrlSelector: SelectorCommand<CommandContext> = {
  type: 'simpleSelector',
  title: 'Change API url',
  key: 'changeApiUrl',
  placeHolder: 'Select environment...',
  options: () => [
    buildAction('reset'),
    buildAction('localhost', 'http://localhost:3000'),
    buildAction('staging', 'https://staging.fake-application.net'),
    buildAction('staging2', 'https://staging2.fake-application.net'),
    buildAction('production', 'https://production.fake-application.net'),
  ],
};

export default changeApiUrlSelector;
