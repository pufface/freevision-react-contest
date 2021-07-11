# Notes to contest solution

Like contests, want to win also want to have a beer :)

## Part 1

Review in PR: https://github.com/pufface/freevision-react-contest/pull/1#pullrequestreview-699006579

Tag of comments:

- `[note]`: my notes or comments or opinions (can be ignored in review)
- `[nit]`: minor things like typos, format, style, import, minor naming, inconsistencies etc (works correctly, but it is kind of bad practice)
- `[normal]`: bugs, bad implementation, bad usage, missing something (should be fixed)
- `[design]`: major things that have bigger impact on codebase, like bad design or structure

In general:

- nice challenge
- some tricky catches
- some serious bed designs
- a few of spaghetti
- lot of nits and notes can be ignored
- having different taste for style and formatting, depends on project conventions
- some comments can be invalid as I do not know original requirements
- arrow fns vs classic fns schizofrenia, just be consistent
- import wildcards

## Part 2

Solution is pushed to: https://github.com/pufface/freevision-react-contest/tree/contest

Comments to solution:

- new Highlighter logic
- new CommandBar
  - extracted commands logic to useCommandEngine hook
  - blueprint omnibar works only as renderer with search logic
  - birds fetching is done as whole json, partial fetching for 40KB is overkill
  - birds filtering locally
  - added commands multilevel support with history and go back via esc
  - tuned types Result and Command to support exhaustive switches by using discriminated unions
