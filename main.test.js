const { JSDOM } = require('jsdom');
const {
  toBeInTheDocument,
  toBeEmptyDOMElement,
  toHaveStyle,
  toHaveAttribute,
  toHaveClass,
} = require('@testing-library/jest-dom/matchers');
const fs = require('fs');
const util = require('util');
const { read } = require('fs');

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

function readModuleFile(path) {
  var filename = require.resolve(path);
  const readFile = util.promisify(fs.readFile);
  return readFile(filename, 'utf8');
}

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
  it.only('should contain the correct CSS variables and values at the root level of the CSS', async () => {
    const cssAsString = await readModuleFile('./styles.css');
    const rootCss = cssAsString.split(':root')[1].split('}')[0];
    const expected = [
      '--primary-colour: rgb(197, 231, 147)',
      '--secondary-colour: antiquewhite',
      '--text-colour: black',
      '--header-size: 24px',
      '--main-text-size: 18px',
      '--border-radius: 10px',
    ];
    expected.forEach((cssVar) => {
      expect(rootCss).toContain(cssVar);
    });
  });
  it('should use the CSS variables in the correct places in the CSS - main', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'main'
    );
    expect(style[`font-size`] == `var(--main-text-size)`).toBeTruthy();
  });
  it('should use the CSS variables in the correct places in the CSS - body', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'body'
    );
    expect(style[`color`] == `var(--text-colour)`).toBeTruthy();
    expect(style[`background-color`] == `var(--secondary-colour)`).toBeTruthy();
  });
  it('should use the CSS variables in the correct places in the CSS - button', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'button'
    );
    expect(style[`font-size`] == `var(--main-text-size)`).toBeTruthy();
    expect(style[`border-radius`] == `var(--border-radius)`).toBeTruthy();
  });
  it('should use the CSS variables in the correct places in the CSS - .plant-header', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.plant-header'
    );
    expect(style[`font-size`] == `var(--header-size)`).toBeTruthy();
  });
  it('should use the CSS variables in the correct places in the CSS - .plant-listing', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.plant-listing'
    );
    expect(style[`background-color`] == `var(--primary-colour)`).toBeTruthy();
    expect(style[`border-radius`] == `var(--border-radius)`).toBeTruthy();
  });
  it('should use the CSS variables in the correct places in the CSS - .plant-pic', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.plant-pic'
    );
    expect(style[`border-radius`] == `var(--border-radius)`).toBeTruthy();
  });
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
