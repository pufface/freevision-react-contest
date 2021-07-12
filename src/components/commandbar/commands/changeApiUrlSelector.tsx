import { IAppConfigContext } from '../../hooks/useConfig';
import { ActionCommand, SelectorCommand } from '../command';

const buildChangeApiUrlSelector = (configContext: IAppConfigContext): SelectorCommand => {
  const buildAction = (title: string, url?: string): ActionCommand => ({
    type: 'action',
    title,
    label: url,
    key: title,
    action() {
      if (url) {
        configContext.set('apiUrl', url);
      } else {
        configContext.reset('apiUrl');
      }
    },
  });

  return {
    type: 'selector',
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
};

export { buildChangeApiUrlSelector };
