import { useState, useCallback, useEffect, useMemo } from 'react';
import { Omnibar, ItemRenderer, ItemListRenderer, ItemPredicate } from '@blueprintjs/select';
import { IconName, Icon, Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import { includesIgnoreCase } from '../../utils/stringUtils';
import Highlighter from '../Highlighter';
import useCommandEngine from './useCommandEnging';
import { Command } from './command';
import root from './commands/root';

const CommandOmmibar = Omnibar.ofType<Command>();

const CommandBar = () => {
  const [isOpen, setOpen] = useState(true);
  const { command, commandResult, commandHistory, pushCommand, popCommand } = useCommandEngine(root);

  useEffect(() => {
    const handleKey = (ev: KeyboardEvent) => {
      if (ev.code === 'Comma' && ev.ctrlKey) {
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const inputProps: InputGroupProps2 = useMemo(() => {
    const placeholderCrumbs = (icon: IconName): JSX.Element => {
      const prev = commandHistory[0];
      const prevPrev = commandHistory[1];
      const prevPrevPrev = commandHistory[2];
      return (
        <div style={{ lineHeight: '40px', color: '#5c7080' }}>
          {prevPrevPrev && <Icon icon="more" style={{ padding: '0 5px' }} />}
          {prevPrev && <Icon icon="chevron-right" style={{ padding: '0 5px' }} />}
          {prevPrev && <span>{prev.title}</span>}
          {prev && <Icon icon="chevron-right" style={{ padding: '0 5px' }} />}
          {prev && <span>{command.title}</span>}
          <Icon icon={icon} style={{ padding: '0 5px' }} />
        </div>
      );
    };
    switch (commandResult.type) {
      case 'loading':
        return {
          leftElement: placeholderCrumbs('time'),
          placeholder: 'Loading...',
        };
      case 'success':
        return {
          leftElement: placeholderCrumbs('chevron-right'),
          placeholder: command.placeHolder,
        };
      case 'error':
        return {
          leftElement: placeholderCrumbs('error'),
          placeholder: commandResult.error,
        };
    }
  }, [commandResult, command, commandHistory]);

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

  const handleSelectItem: (item: Command) => void = useCallback(
    (command: Command) => {
      console.log('select command', command);
      switch (command.type) {
        case 'selector':
          pushCommand(command);
          return;
        case 'action':
          command.action();
          return;
      }
    },
    [pushCommand]
  );

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
      return (
        <Menu>
          <MenuItem disabled={true} text="No matching search commands" />
        </Menu>
      );
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
