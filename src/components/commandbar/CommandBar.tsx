import { useState, useCallback, useMemo } from 'react';
import { Omnibar, ItemRenderer, ItemListRenderer, ItemPredicate } from '@blueprintjs/select';
import { Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import { includesIgnoreCase } from '../../utils/stringUtils';
import Highlighter from '../Highlighter';
import useCommandEngine from './useCommandEnging';
import { Command } from './command';
import root from './commands/root';

const CommandOmmibar = Omnibar.ofType<Command>();

const CommandBar = () => {
  const [isOpen, setOpen] = useState(true);
  const { command, commandResult, commandHistory, pushCommand, popCommand } = useCommandEngine(root);

  const inputProps: InputGroupProps2 = useMemo(() => {
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
  }, [commandResult, command]);

  const items = useMemo(() => {
    switch (commandResult.type) {
      case 'loading':
        return [];
      case 'success':
        return commandResult.value;
      case 'error':
        return [];
    }
  }, [commandResult]);

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

  const itemRenderer: ItemRenderer<Command> = useCallback((command, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        active={modifiers.active}
        text={<Highlighter text={command.title} query={query} />}
        label={command.label}
        key={command.key}
        onClick={handleClick}
      />
    );
  }, []);

  const itemListRenderer: ItemListRenderer<Command> = useCallback(({ renderItem, items, filteredItems }) => {
    if (items.length === 0) {
      return (
        <Menu>
          <MenuItem disabled={true} text="No available commands" />
        </Menu>
      );
    }
    if (filteredItems.length === 0) {
      return <Menu></Menu>;
    }
    return <Menu>{filteredItems.map(renderItem)}</Menu>;
  }, []);

  const itemPredicate: ItemPredicate<Command> = useCallback((query, { title }) => includesIgnoreCase(title, query), []);

  const handleClose = useCallback(() => {
    if (commandHistory.length > 0) {
      popCommand();
    } else {
      setOpen(false);
    }
  }, [commandHistory, popCommand]);

  return (
    <CommandOmmibar
      inputProps={inputProps}
      isOpen={isOpen}
      onClose={handleClose}
      items={items}
      itemsEqual="key"
      onItemSelect={handleSelectItem}
      itemPredicate={itemPredicate}
      itemListRenderer={itemListRenderer}
      itemRenderer={itemRenderer}
    />
  );
};

export default CommandBar;
