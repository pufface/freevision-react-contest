import { History } from '../CommandBar';
import { ActionCommand, SelectorCommand } from '../command';

const buildGoToPageSelector = (history: History): SelectorCommand => {
  const buildAction = (title: string, url: string): ActionCommand => ({
    type: 'action',
    title,
    key: title,
    action() {
      history.push(url);
    },
  });

  return {
    type: 'selector',
    title: 'Go to',
    key: 'goTo',
    placeHolder: 'Select page...',
    options: () => [buildAction('Home', '/'), buildAction('Page one', '/one'), buildAction('Page two', '/two')],
  };
};

export { buildGoToPageSelector };
