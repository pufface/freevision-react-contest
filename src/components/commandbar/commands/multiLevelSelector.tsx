import { Command, SelectorCommand } from '../engine/command';
import { CommandContext } from '../CommandBar';

const halfSplitter = <T,>(input: T[]) => {
  const length = input.length;
  return [input.slice(0, length / 2), input.slice(length / 2)];
};

const buildBinarySelect = (items: string[]): Command<CommandContext>[] => {
  if (items.length <= 4) {
    return items.map((item) => ({
      type: 'action',
      title: item,
      key: item,
      action: ({ showToast }) => {
        showToast(item);
      },
    }));
  }
  const [first, second] = halfSplitter(items);
  return [
    {
      type: 'simpleSelector',
      title: `Select ${first[0]} - ${first[first.length - 1]}`,
      key: `Select ${first[0]} - ${first[first.length - 1]}`,
      placeHolder: 'Select option...',
      options: () => buildBinarySelect(first),
    },
    {
      type: 'simpleSelector',
      title: `Select ${second[0]} - ${second[second.length - 1]}`,
      key: `Select ${second[0]} - ${second[second.length - 1]}`,
      placeHolder: 'Select option...',
      options: () => buildBinarySelect(second),
    },
  ];
};

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const multiLevelSelector: SelectorCommand<CommandContext> = {
  type: 'simpleSelector',
  title: `Binary selector`,
  key: `binarySelector`,
  placeHolder: 'Select option...',
  options: () => buildBinarySelect(alphabet),
};

export default multiLevelSelector;
