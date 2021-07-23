import { useState, useEffect, useMemo, useCallback } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { IconName, Icon, Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import Highlighter from '../../Highlighter';
import useCommandHistory from './useCommandHistory';
import useCommandFetcher, { Options } from './useCommandFetcher';
import { Command, SelectorCommand } from './command';

type CommandBarEngineProps<T> = {
  rootCommand: SelectorCommand<T>;
  context: T;
};

const CommandBarEngine = <T,>({ rootCommand, context }: CommandBarEngineProps<T>) => {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { currentCommand, historicCommands, pushCommand, popCommand, resetHistory } = useCommandHistory(rootCommand);
  const { result, setSearchQuery } = useCommandFetcher(currentCommand, '');

  const CommandOmmibar = Omnibar.ofType<Command<T>>();

  const close = useCallback(() => {
    setOpen(false);
    resetHistory();
  }, [resetHistory]);

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

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  const currentItems: Options<T> = useMemo(() => {
    switch (result.type) {
      case 'success':
        return result.value;
      case 'loading':
      case 'error':
        return {
          totalCount: 0,
          options: [],
        };
    }
  }, [result]);

  const inputPropsWithResultAndHistory: InputGroupProps2 = useMemo(() => {
    const placeholderCrumbs = (icon: IconName): JSX.Element => {
      const [prev, prevPrev, prevPrevPrev] = historicCommands;
      return (
        <div style={{ lineHeight: '40px', color: '#5c7080' }}>
          {prevPrevPrev && <Icon icon="more" style={{ padding: '0 5px' }} />}
          {prevPrev && <Icon icon="chevron-right" style={{ padding: '0 5px' }} />}
          {prevPrev && <span>{prev.title}</span>}
          {prev && <Icon icon="chevron-right" style={{ padding: '0 5px' }} />}
          {prev && <span>{currentCommand.title}</span>}
          <Icon icon={icon} style={{ padding: '0 5px' }} />
        </div>
      );
    };
    switch (result.type) {
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
          placeholder: currentCommand.placeHolder,
        };
      case 'error':
        return {
          leftElement: placeholderCrumbs('error'),
          leftIcon: null,
          placeholder: result.error,
        };
    }
  }, [currentCommand, historicCommands, result]);

  return (
    <CommandOmmibar
      inputProps={inputPropsWithResultAndHistory}
      isOpen={isOpen}
      onClose={() => {
        if (historicCommands.length > 0) {
          popCommand();
          setQuery('');
        } else {
          close();
        }
      }}
      items={currentItems.options}
      resetOnSelect
      resetOnQuery
      itemsEqual="key"
      onItemSelect={(selectedCommand) => {
        if (selectedCommand.type === 'simpleSelector' || selectedCommand.type === 'querySelector') {
          pushCommand(selectedCommand);
        } else {
          Promise.resolve(selectedCommand.action(context)).then(close);
        }
      }}
      query={query}
      onQueryChange={setSearchQuery}
      itemListRenderer={({ renderItem, items, query, itemsParentRef }) => {
        if (items.length === 0 && query === '') {
          return (
            <Menu ulRef={itemsParentRef}>
              <MenuItem disabled={true} text="No commands are available" />
            </Menu>
          );
        }
        if (items.length === 0 && query !== '') {
          return (
            <Menu ulRef={itemsParentRef}>
              <MenuItem disabled={true} text={`No commands match search criteria '${query}'`} />
            </Menu>
          );
        }
        return (
          <Menu ulRef={itemsParentRef}>
            {items.map(renderItem)}
            {currentItems.totalCount !== items.length && (
              <MenuItem
                disabled={true}
                text={`Showing first ${items.length}/${currentItems.totalCount} results, please specify search query`}
              />
            )}
          </Menu>
        );
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
