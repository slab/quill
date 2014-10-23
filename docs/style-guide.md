# Style Guide

Code style is very subjective but consistency is very important for a healthy codebase. Quill strives to follow good programming practices and the language specific guidelines so those will not be reproduced here. However some less obvious guidelines are listed below.

If there is ever uncertainty, please look at other parts of the codebase and mimic that style.


### General

- Use two spaces for tabs
- No trailing whitespace on any lines


### Operators

- Always use parenthesis for function calls
- Use brackets for one line object definitions

```coffeescript
console.log('Yes')  # Yes
console.log 'No'    # No

config = { attack: 10, defense: 10 }  # Yes
config = attack: 10, defense: 10      # No

# Okay
config =
  attack: 10
  defense: 10
```


### Classes

- Use an explicit `this` when referencing methods
- Use `@` when referencing instance variables

```coffeescript
class Tower
  @constructor: (strength, toughness) ->
    @strength = strength        # Yes
    this.toughness = toughness  # No

    this.attack()               # Yes
    @defend()                   # No

  attack: ->

  defend: ->
```
