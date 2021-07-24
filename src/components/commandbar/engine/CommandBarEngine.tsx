import { useState, useEffect, useMemo } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { IconName, Icon, Menu, MenuItem, InputGroupProps2 } from '@blueprintjs/core';
import Highlighter from '../../Highlighter';
import useCommandHistory from './useCommandHistory';
import useCommandFetcher, { emptyOptions, Options } from './useCommandFetcher';
import { Command, SelectorCommand } from './command';

type CommandBarEngineProps<T> = {
  rootCommand: SelectorCommand<T>;
  context: T;
};

const CommandBarEngine = <T,>({ rootCommand, context }: CommandBarEngineProps<T>) => {
  const CommandOmmibar = Omnibar.ofType<Command<T>>();

  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { currentCommand, historicCommands, pushCommand, popCommand, resetHistory } = useCommandHistory(rootCommand);
  const result = useCommandFetcher(currentCommand, query);
  const [currentOptions, setCurrentOpitons] = useState<Options<T>>(emptyOptions());

  useEffect(() => {
    const handleKey = (ev: KeyboardEvent) => {
      if (ev.code === 'Period' && ev.ctrlKey) {
        setOpen((open) => !open);
        setQuery('');
        resetHistory();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [resetHistory]);

  useEffect(() => {
    setCurrentOpitons(emptyOptions());
  }, [currentCommand]);

  useEffect(() => {
    if (result.type === 'success') {
      setCurrentOpitons(result.value);
    } else if (result.type === 'error') {
      setCurrentOpitons(emptyOptions());
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
        setQuery('');
        if (historicCommands.length > 0) {
          popCommand();
        } else {
          setOpen(false);
        }
      }}
      items={currentOptions.options}
      itemsEqual="key"
      onItemSelect={(selectedCommand) => {
        setQuery('');
        if (selectedCommand.type === 'simpleSelector' || selectedCommand.type === 'querySelector') {
          pushCommand(selectedCommand);
        } else {
          Promise.resolve(selectedCommand.action(context)).then(() => setOpen(false));
        }
      }}
      query={query}
      onQueryChange={setQuery}
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
            {currentOptions.totalCount !== items.length && (
              <MenuItem
                disabled={true}
                text={`Showing first ${items.length}/${currentOptions.totalCount} results, please specify search query`}
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
