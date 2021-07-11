import { useState } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import { includesIgnoreCase } from '../../utils/stringUtils';
import Highlighter from '../Highlighter';
import useCommandEngine from './useCommandEnging';
import { Command } from './command';
import root from './commands/root';

const ControlMenu = ({ text }: { text: string }) => (
  <Menu>
    <MenuItem disabled={true} text={text} />
  </Menu>
);

const CommandOmmibar = Omnibar.ofType<Command>();

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
