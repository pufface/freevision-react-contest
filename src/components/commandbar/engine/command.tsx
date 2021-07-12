type CommandBase = {
  title: string;
  key: string;
  label?: string;
};

type Command = SelectorCommand | ActionCommand;

type SelectorCommand = CommandBase & {
  type: 'selector';
  placeHolder: string;
  options: () => Promise<Command[]> | Command[];
};

type ActionCommand = CommandBase & {
  type: 'action';
  action: () => Promise<void> | void;
};

export type { Command, SelectorCommand, ActionCommand };
