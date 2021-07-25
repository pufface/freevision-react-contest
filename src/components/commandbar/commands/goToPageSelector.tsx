import { CommandContext } from '../CommandBar';
import { ActionCommand, SelectorCommand } from '../engine/command';

const buildAction = (title: string, url: string): ActionCommand<CommandContext> => ({
  type: 'action',
  title,
  key: title,
  action({ history }) {
    history.push(url);
  },
});

const goToPageSelector: SelectorCommand<CommandContext> = {
  type: 'simpleSelector',
  title: 'Go to',
  key: 'goTo',
  placeHolder: 'Select page...',
  options: () => [buildAction('Home', '/'), buildAction('Page one', '/one'), buildAction('Page two', '/two')],
};

export default goToPageSelector;
