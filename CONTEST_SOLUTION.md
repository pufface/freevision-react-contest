# Notes to contest solution

Like contests, want to win also like beer :)

In general:

- nice challenge
- some tricky catches
- some serious bad designs
- a few of spaghetti
- lot of nits and notes can be ignored
- some comments can be invalid as I do not know original requirements and/or project code conventions
- Omnibar component from UX perspective is better to keep flat (like original example, also mac spotlight is flat). For multilevel nesting of commands would be better entirely different component with some navigation between levels and showing previous choice/choices and so on. For current component design, one or two levels of commands are acceptable, more levels can be hard to keep in mind from user perspective. Also it is not optimal for mobile usage, as whole blueprint.

## Part 1

Review in PR: https://github.com/pufface/freevision-react-contest/pull/1#pullrequestreview-699006579

Tag of comments:

- `[note]`: my notes or comments or opinions (can be kind of ignored in review)
- `[nit]`: minor things like typos, format, style, import, naming, inconsistencies etc (works correctly, it is kind of bad practice, can be fixed quickly)
- `[normal]`: bugs, bad implementation, bad usage, missing something (should be fixed)
- `[design]`: major things that have bigger impact on codebase, like bad design or structure (should be fixed and reconsidered again)

## Part 2

Solution is pushed to: https://github.com/pufface/freevision-react-contest/tree/contest

Comments to solution:

- new Highlighter logic
- new CommandBar
  - extracted commands logic to useCommandEngine hook
  - blueprint omnibar works only as renderer with search logic
  - birds fetching is done as whole json, partial fetching for 40KB is overkill
  - birds filtering is done locally
  - added commands multilevel support with history and go back via esc
  - tuned types Result and Command to support exhaustive switches by using discriminated unions
  - passing context to command actions individually, it is kind of tricky, wanted to separate CommandBar from command action contexts
