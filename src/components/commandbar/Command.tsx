type CommandBase = {
  title: string;
  key: string;
};

type Command = SelectorCommand | ActionCommand;

type SelectorCommand = CommandBase & {
  type: 'selector';
  label: string;
  getOptions: () => Promise<Command[]>;
};

type ActionCommand = CommandBase & {
  type: 'action';
  action: () => Promise<void>;
};

export type { Command, SelectorCommand, ActionCommand };
