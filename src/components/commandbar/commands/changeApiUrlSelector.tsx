import { ActionCommand, SelectorCommand } from '../command';

const buildChangeApiUrlAction = (title: string, url?: string): ActionCommand => ({
  type: 'action',
  title,
  label: url,
  key: title,
  action() {
    return Promise.resolve().then(() => console.log(title, url));
  },
});

const changeApiUrlSelector: SelectorCommand = {
  type: 'selector',
  title: 'Change API url',
  key: 'changeApiUrl',
  placeHolder: 'Select environment...',
  options: () => [
    buildChangeApiUrlAction('reset'),
    buildChangeApiUrlAction('localhost', 'http://localhost:3000'),
    buildChangeApiUrlAction('staging', 'https://staging.fake-application.net'),
    buildChangeApiUrlAction('staging2', 'https://staging2.fake-application.net'),
    buildChangeApiUrlAction('production', 'https://production.fake-application.net'),
  ],
};

export default changeApiUrlSelector;
