# CSS Functions

## Concepts to master:

### Context:

- New to css
- Allow us some of the power of css preprocessors

### Syntax

- --some-variable: value;
- some-property: var(--some-variable);

## Your tasks to test your mastery of these:

### Task 1

Make a set of CSS variables at the root level of your CSS. 
Give them the following names and values: 

- primary-colour: rgb(197, 231, 147)
- secondary-colour: antiquewhite
- text-colour: black
- header-size: 24px
- main-text-size: 12px
- border-radius: 10px

### Task 2

Now use the variables you've just made in the following places 
in your CSS (the appearance of the website in the browser should 
still look the same after you've swapped in the variables):

- primary-colour: .plant-listing background
- secondary-colour: body background
- text-colour: body text
- header-size: .plant-header
- main-text-size: main text, button
- border-radius: .plant-listing, .plant-pic, buttons

### Task 3

The main-text-size value of 12px makes the text on the page a 
bit hard to read, don't you think? By only changing the value of the 
main-text-size variable, change it so that all non-heading text on 
the page is 18px instead.

### BONUS - Task 4

By this point, you might be wondering why we bothered making the 
variables in the first place if the website still looks the same! 
But have you noticed the button in the footer that says "Toggle 
dark mode" yet? It's time to use the power of CSS variables to hook 
it up.

a) Create a new class called ".dark-mode-theme". Only within this 
class, reassign some of the CSS variables you made earlier like so: 

- primary-colour: rgb(0, 87, 0)
- secondary-colour: black
- text-colour: white

b) In your JavaScript file, create a function that uses this button 
(with id "dark-mode-button") to toggle this class on and off of the 
body of your webpage. Now you have a snazzy dark mode button, thanks 
to the power of CSS variables!

