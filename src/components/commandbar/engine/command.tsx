type CommandBase = {
  title: string;
  key: string;
  label?: string;
};

type SimpleSelectorCommand<T> = CommandBase & {
  type: 'simpleSelector';
  placeHolder: string;
  options: () => Command<T>[];
};

type QuerySelectorCommand<T> = CommandBase & {
  type: 'querySelector';
  placeHolder: string;
  options: (query: string) => Promise<{
    totalCount: number;
    options: Command<T>[];
  }>;
};

type ActionCommand<T> = CommandBase & {
  type: 'action';
  action: (context: T) => Promise<void> | void;
};

type SelectorCommand<T> = SimpleSelectorCommand<T> | QuerySelectorCommand<T>;

type Command<T> = SelectorCommand<T> | ActionCommand<T>;

export type { Command, SelectorCommand, ActionCommand, SimpleSelectorCommand, QuerySelectorCommand };
