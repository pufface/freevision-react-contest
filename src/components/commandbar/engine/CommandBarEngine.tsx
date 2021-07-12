import { useState, useEffect, useMemo, useCallback } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { IconName, Icon, Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import { includesIgnoreCase } from '../../../utils/stringUtils';
import Highlighter from '../../Highlighter';
import useCommandEngine from './useCommandEnging';
import { Command, SelectorCommand } from './command';

type CommandBarEngineProps<T> = {
  rootCommand: SelectorCommand<T>;
  context: T;
};

const CommandBarEngine = <T,>({ rootCommand, context }: CommandBarEngineProps<T>) => {
  const [isOpen, setOpen] = useState(false);
  const { command, commandResult, commandHistory, pushCommand, popCommand, setRootCommand } = useCommandEngine(
    rootCommand,
    context
  );

  const CommandOmmibar = Omnibar.ofType<Command<T>>();

  const close = useCallback(() => {
    setOpen(false);
    setRootCommand(rootCommand);
  }, [setRootCommand, rootCommand]);

  useEffect(() => {
    const handleKey = (ev: KeyboardEvent) => {
      if (ev.code === 'Period' && ev.ctrlKey) {
        if (isOpen) {
          close();
        } else {
          setOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [close, isOpen]);

  const inputPropsWithResultAndHistory: InputGroupProps2 = useMemo(() => {
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
          leftIcon: null,
          placeholder: 'Loading...',
        };
      case 'success':
        return {
          leftElement: placeholderCrumbs('chevron-right'),
          leftIcon: null,
          placeholder: command.placeHolder,
        };
      case 'error':
        return {
          leftElement: placeholderCrumbs('error'),
          leftIcon: null,
          placeholder: commandResult.error,
        };
    }
  }, [commandResult, command, commandHistory]);

  return (
    <CommandOmmibar
      inputProps={inputPropsWithResultAndHistory}
      isOpen={isOpen}
      onClose={() => {
        if (commandHistory.length > 0) {
          popCommand();
        } else {
          close();
        }
      }}
      items={commandResult.type === 'success' ? commandResult.value : []}
      itemsEqual="key"
      onItemSelect={(selectedCommand) => {
        if (selectedCommand.type === 'selector') {
          pushCommand(selectedCommand);
        } else {
          Promise.resolve(selectedCommand.action(context)).then(close);
        }
      }}
      itemPredicate={(query, { title }) => includesIgnoreCase(title, query)}
      itemListRenderer={({ renderItem, items, filteredItems }) => {
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

export default CommandBarEngine;
