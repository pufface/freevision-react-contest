import { ActionCommand, SelectorCommand } from '../command';

const buildGoToPageAction = (title: string, url: string): ActionCommand => ({
  type: 'action',
  title,
  key: title,
  action() {
    return Promise.resolve().then(() => console.log(url));
  },
});

const goToPageSelector: SelectorCommand = {
  type: 'selector',
  title: 'Go to',
  key: 'goTo',
  placeHolder: 'Select page...',
  options: () => [
    buildGoToPageAction('Home', '/'),
    buildGoToPageAction('Page one', '/one'),
    buildGoToPageAction('Page two', '/two'),
  ],
};

export default goToPageSelector;
