import { useState, useEffect } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import { includesIgnoreCase } from '../../utils/stringUtils';
import Highlighter from '../Highlighter';
import resultFactory, { Result } from '../../utils/result';
import { ActionCommand, SelectorCommand, Command } from './command';

const goToPageAction = (title: string, url: string): ActionCommand => ({
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
  options: () => [goToPageAction('Home', '/'), goToPageAction('Page one', '/one'), goToPageAction('Page two', '/two')],
};

const changeApiUrlAction = (title: string, url?: string): ActionCommand => ({
  type: 'action',
  title,
  label: url,
  key: title,
  action() {
    return Promise.resolve().then(() => console.log(title, url));
  },
});

const changeApiUrlSelector: SelectorCommand = {
  type: 'selector',
  title: 'Change API url',
  key: 'changeApiUrl',
  placeHolder: 'Select environment...',
  options: () => [
    changeApiUrlAction('reset'),
    changeApiUrlAction('localhost', 'http://localhost:3000'),
    changeApiUrlAction('staging', 'https://staging.fake-application.net'),
    changeApiUrlAction('staging2', 'https://staging2.fake-application.net'),
    changeApiUrlAction('production', 'https://production.fake-application.net'),
  ],
};

const toggleLocalizationAction: ActionCommand = {
  type: 'action',
  title: 'Toggle localization',
  key: 'toggleLocalization',
  action: () => Promise.resolve().then(() => console.log('toggle')),
};

const root: SelectorCommand = {
  type: 'selector',
  title: '',
  key: 'root',
  label: '',
  placeHolder: 'Enter command...',
  options: () => [goToPageSelector, changeApiUrlSelector, toggleLocalizationAction],
};

const ControlMenu = ({ text }: { text: string }) => (
  <Menu>
    <MenuItem disabled={true} text={text} />
  </Menu>
);

const CommandOmmibar = Omnibar.ofType<Command>();

const useCommandEngine = (root: SelectorCommand) => {
  const [current, setCurrent] = useState(root);
  const [history, setHistory] = useState<SelectorCommand[]>([]);
  const [result, setResult] = useState<Result<Command[], string>>(resultFactory.loading());
  useEffect(() => {
    setResult(resultFactory.loading());
    Promise.resolve(current.options())
      .then((options) => {
        setResult(resultFactory.success(options));
      })
      .catch((error) => {
        console.error(error);
        setResult(resultFactory.error('Error fetching'));
      });
  }, [current]);
  const push = (command: SelectorCommand): void => {
    setCurrent(command);
    setHistory([current, ...history]);
  };
  const pop = (): SelectorCommand | undefined => {
    const [first, ...rest] = history;
    if (!first) {
      return;
    }
    setCurrent(first);
    setHistory(rest);
    return first;
  };
  return {
    command: current,
    commandResult: result,
    commandHistory: history,
    pushCommand: push,
    popCommand: pop,
  };
};

const CommandBar = () => {
  const [isOpen, setOpen] = useState(true);
  const { command, commandResult, commandHistory, pushCommand, popCommand } = useCommandEngine(root);

  const inputProps = (): InputGroupProps2 => {
    // const placeholderCrumbs = (icon: IconName): JSX.Element => {
    //   const previous = commandHistory[0]?.key !== "root" ? ;
    //   return (
    //     <div style={{ lineHeight: '40px' }}>
    //       {previous && <span>...</span>}
    //       {previous && <Icon icon="chevron-right" />}
    //       <span>{command.title}</span>
    //       <Icon icon={icon} />
    //     </div>
    //   );
    // };
    switch (commandResult.type) {
      case 'loading':
        return {
          leftIcon: 'time',
          placeholder: 'Loading...',
        };
      case 'success':
        return {
          leftIcon: 'chevron-right',
          placeholder: command.placeHolder,
        };
      case 'error':
        return {
          leftIcon: 'error',
          placeholder: commandResult.error,
        };
    }
  };

  const items = () => {
    switch (commandResult.type) {
      case 'loading':
        return [];
      case 'success':
        return commandResult.value;
      case 'error':
        return [];
    }
  };

  const handleSelectItem = (command: Command): void => {
    console.log('select command', command);
    switch (command.type) {
      case 'selector':
        pushCommand(command);
        return;
      case 'action':
        command.action();
        return;
    }
  };

  return (
    <CommandOmmibar
      inputProps={inputProps()}
      isOpen={isOpen}
      onClose={(event) => {
        if (commandHistory.length > 0) {
          popCommand();
        } else {
          setOpen(false);
        }
      }}
      items={items()}
      itemsEqual="key"
      onItemSelect={handleSelectItem}
      itemPredicate={(query, { title }) => includesIgnoreCase(title, query)}
      itemListRenderer={({ renderItem, items, filteredItems }) => {
        if (items.length === 0) {
          return <ControlMenu text="No available commands" />;
        }
        if (filteredItems.length === 0) {
          return <ControlMenu text="No matching search commands" />;
        }
        return <Menu>{filteredItems.map(renderItem)}</Menu>;
      }}
      itemRenderer={(command, { handleClick, modifiers, query }) => (
        <MenuItem
          active={modifiers.active}
          text={<Highlighter text={command.title} query={query} />}
          label={command.label}
          key={command.key}
          onClick={handleClick}
        />
      )}
    />
  );
};

export default CommandBar;
