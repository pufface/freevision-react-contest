import { useState, useEffect, useMemo } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { IconName, Icon, Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import { includesIgnoreCase } from '../../../utils/stringUtils';
import Highlighter from '../../Highlighter';
import useCommandEngine from './useCommandEnging';
import { Command, SelectorCommand } from './command';

const CommandOmmibar = Omnibar.ofType<Command>();

type CommandBarEngineProps = {
  root: SelectorCommand;
};

const CommandBarEngine: React.FC<CommandBarEngineProps> = ({ root }) => {
  const [isOpen, setOpen] = useState(false);
  const { command, commandResult, commandHistory, pushCommand, popCommand } = useCommandEngine(root);

  useEffect(() => {
    const handleKey = (ev: KeyboardEvent) => {
      if (ev.code === 'Period' && ev.ctrlKey) {
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

  return (
    <CommandOmmibar
      inputProps={inputProps}
      isOpen={isOpen}
      onClose={() => {
        if (commandHistory.length > 0) {
          popCommand();
        } else {
          setOpen(false);
        }
      }}
      items={items}
      resetOnSelect
      resetOnQuery
      itemsEqual="key"
      onItemSelect={(command) => {
        switch (command.type) {
          case 'selector':
            pushCommand(command);
            return;
          case 'action':
            Promise.resolve(command.action()).then(() => {
              setOpen(false);
            });
            return;
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
          onClick={(e) => {
            console.log('click');
            handleClick(e);
          }}
        />
      )}
    />
  );
};

export default CommandBarEngine;
