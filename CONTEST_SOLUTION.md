# Notes to contest solution

Like contests, want to win also like beer :)

## Part 1

Review in PR: https://github.com/pufface/freevision-react-contest/pull/1#pullrequestreview-699006579

Tag of comments:

- `[note]`: my notes or comments or opinions (can be kind of ignored in review)
- `[nit]`: minor things like typos, format, style, import, naming, inconsistencies etc (works correctly, it is kind of bad practice, can be fixed quickly)
- `[normal]`: bugs, bad implementation, bad usage, missing something (should be fixed)
- `[design]`: major things that have bigger impact on codebase, like bad design or structure or approach (should be fixed and reconsidered again)

Notes to review:

- nice challenge
- some tricky catches
- some serious bad designs
- a few of spaghetti
- lot of nits and notes
- some comments can be invalid as I do not know original requirements and/or project code conventions

## Part 2

Solution is pushed to: https://github.com/pufface/freevision-react-contest/tree/contest

Notes to solution:

- omnibar thoughts
  - How many levels of command nesting is reasonable? From UX perspective I think is reasonable one or two levels of nesting commands, idealy keep it flat. More levels can be tedious and hard to navigate and they need some kind of navigation and showing current command and history of previous choices.
  - Omnibar is not optimal for mobile usage, comes together with bluprint design and goals. Text input is not fully responsive and also text searching is not best experience on mobile.
  - Searching command options on server is resonable for huge amount of options. For smaller number of options (like current 40KB json, about 1000 options) might be better to fetch it all and do filtering on client. According assignemnt, search should be done on server.
  - Pagination comes to mind together with searhing larger number of options. But again, it wouldn't be best experience introducing paginaiton in current design of omnibar component.
  - How many action contexts is need? Relate to omnibar design and its purpose, number of context should be limited as well as number of types of commands.
  - Omnibar should be kept simple. If there are other requirements leading to more complexity or difficult UX, consider entirely different component.
- new Highlighter component
- redesigned CommandBar component
  - extracted command options fetching logic to useCommandFetcher hook
  - extracted command history to useCommandHistory hook
  - blueprint omnibar works only as renderer
  - birds searching is done remotely on server with debounce optimalization, response items limitation and race condition free
  - added commands multilevel support with history and go back via esc or click
  - tuned types Result and Command to support exhaustive switches by using discriminated unions
  - data structures are designed with imposibility of representation of imposible states
  - passing command actions context is one and same for all actions, comming out from thoughts above
  - without adding new dependecies
