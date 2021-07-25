import { SelectorCommand, ActionCommand } from '../engine/command';
import { CommandContext } from '../CommandBar';

type Bird = {
  id: number;
  title: string;
};

const parseBird = (object: any): Bird => {
  const id = object['id'];
  const title = object['title'];
  if (typeof id !== 'number' || typeof title !== 'string') {
    throw Error('Can not parse bird');
  }
  return {
    id,
    title,
  };
};

const buildAction = ({ id, title }: Bird): ActionCommand<CommandContext> => ({
  type: 'action',
  title,
  key: title,
  label: String(id),
  action: ({ showToast }) => {
    showToast(`${title}: ${id}`);
  },
});

const FETCH_LIMIT = 100;

const birdSelector: SelectorCommand<CommandContext> = {
  type: 'querySelector',
  title: 'Show birds',
  key: 'showBirds',
  placeHolder: 'Select bird...',
  options: async (query: string) => {
    const urlParams = new URLSearchParams({ q: query, _limit: String(FETCH_LIMIT) });
    const result = await fetch(`http://localhost:3001/birds?${urlParams}`);
    const objects = await result.json();
    const birds = objects.map(parseBird);
    const options = birds.map(buildAction);
    const totalCount = Number(result.headers.get('X-Total-Count') || options.length);
    return {
      options,
      totalCount,
    };
  },
};

export default birdSelector;
