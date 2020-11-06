const { JSDOM } = require('jsdom');
const {
  toBeInTheDocument,
  toBeEmptyDOMElement,
  toHaveStyle,
  toHaveAttribute,
  toHaveClass,
} = require('@testing-library/jest-dom/matchers');

expect.extend({
  toBeInTheDocument,
  toBeEmptyDOMElement,
  toHaveStyle,
  toHaveAttribute,
  toHaveClass,
});

const LEVELS = {
  one: 'level_one',
  two: 'level_two',
  three: 'level_three',
};

let document = null;
let window = null;
beforeEach(async () => {
  const jsDOM = await JSDOM.fromFile('index.html', {
    runScripts: 'dangerously',
    resources: 'usable',
    url: `file://${__dirname}/`,
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script'],
    },
  });
  await new Promise((res) => {
    jsDOM.window.onload = res;
  });
  document = jsDOM.window.document;
  window = jsDOM.window;
});

afterEach(() => {
  document = null;
  window = null;
});

describe(LEVELS.one, () => {
  it.todo(
    'should contain the correct CSS variables and values at the root level of the CSS'
  ); //can put the variable names and values in arrays and do the ollll' .forEach so I don't have to write an individual test for each!
  it.todo('should use the CSS variables in the correct places in the CSS'); //again, can just .forEach over some arrays to cut down on repetition
});
describe(LEVELS.two, () => {
  it.todo(
    'should have the value of main-text-size be 18px (without changing any of the places in the rest of the CSS)'
  );
});
describe(LEVELS.three, () => {
  it.todo(
    'should have a .dark-mode-theme class where the color variables are correctly changed to the dark mode theme colors'
  );
  it.todo(
    'should have function hooked up to #dark-mode-button button that toggles the .dark-mode-theme class on and off'
  );
});
