# Notes to contest solution

Like contests, want to win also want to have a beer :)

## Part 1

Review in PR: https://github.com/pufface/freevision-react-contest/pull/1#pullrequestreview-699006579

Tag of comments:

- [note]: my note or comment or opinion (can be ignored in review)
- [nit]: minor things like typos, format, style, import, minor namings etc (works correctly, but it is kind of bad practice)
- [normal]: normal things ussually in current scope, like bad implementation, bad usage of something, missing something
- [design]: major things that have bigger impact on codebase, like bad design or structure

In general:

- having different taste for style and formatting
- lot of `[notes]` & `[nits]`, can be ginored
- a few `[normal]`, should be fixed
- a couple of `[design]`, should be refactor

## Part 2

Solution is pushed to: https://github.com/pufface/freevision-react-contest/tree/contest

Comments to solution:

- new Highligter logic
- new CommandBar
  - extracted commands logic with history to useCommandEngine hook
  - blueprint omnibar works only as renderer with search logic
  - birds fetching is done as whole json, partial fetching for 40KB is overkill
  - birds filtered localy
  - added multilevel support with command history and go back
  - tuned types Result and Command to support exhaustive switchs by using discrimited unions
- next todo, not done due to run out of the time
  - not well performant when showing 1000 items, need to implement some kind of limit or pagination
