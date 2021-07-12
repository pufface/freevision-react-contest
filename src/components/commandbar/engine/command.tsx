type CommandBase = {
  title: string;
  key: string;
  label?: string;
};

type Command<T> = SelectorCommand<T> | ActionCommand<T>;

type SelectorCommand<T> = CommandBase & {
  type: 'selector';
  placeHolder: string;
  options: (context: T) => Promise<Command<T>[]> | Command<T>[];
};

type ActionCommand<T> = CommandBase & {
  type: 'action';
  action: (context: T) => Promise<void> | void;
};

export type { Command, SelectorCommand, ActionCommand };
