import { SelectorCommand, ActionCommand } from '../command';

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

const buildShowBirdAction = ({ id, title }: Bird): ActionCommand => ({
  type: 'action',
  title,
  key: title,
  label: String(id),
  action: () => console.log(title, id),
});

const birdSelector: SelectorCommand = {
  type: 'selector',
  title: 'Show birds',
  key: 'showBirds',
  placeHolder: 'Select bird...',
  options: async () => {
    const url = 'http://localhost:3001/birds';
    const result = await fetch(url);
    const objects = await result.json();
    const birds = objects.map(parseBird);
    return birds.map(buildShowBirdAction);
  },
};

export default birdSelector;
