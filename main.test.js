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
const rewire = require('rewire');

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
  it('should contain the correct CSS variables and values at the root level of the CSS', async () => {
    const cssAsString = await readModuleFile('./styles.css');
    const rootCss = cssAsString.split(':root')[1].split('}')[0];
    const expected = [
      '--primary-colour: rgb(197, 231, 147)',
      '--secondary-colour: antiquewhite',
      '--text-colour: black',
      '--header-size: 24px',
      '--main-text-size',
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
  it(`should have the value of main-text-size be 18px (without changing any of the places where it's used to 18px in the rest of the CSS)`, async () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'main'
    );
    expect(style[`font-size`] == `18px`).not.toBeTruthy();
    const cssAsString = await readModuleFile('./styles.css');
    const rootCss = cssAsString.split(':root')[1].split('}')[0];
    const expected = '--main-text-size: 18px';
    expect(rootCss).toContain(expected);
    expect(cssAsString).not.toContain('font-size: 18px');
  });
});

describe(LEVELS.three, () => {
  it('should have a .dark-mode-theme class where the color variables are correctly changed to the dark mode theme colors', async () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.dark-mode-theme'
    );
    expect(style['--primary-colour']).toBe('rgb(0, 87, 0)');
    expect(style['--secondary-colour']).toBe('black');
    expect(style['--text-colour']).toBe('white');
  });
  it('should have function called toggleDarkMode in the JS that toggles the .dark-mode-theme class on and off of the body', () => {
    //FIXME: Not sure why rewire is breaking here! What I want to do is use rewire to hand in the JSDOM version of document so that toggleDarkMode can act on it, like I've done in JS tests previously.
    // const main = rewire('./main.js');
    // main.__set__('document', document);
    // main.__get__('toggleDarkMode')();
    const actual = window.toggleDarkMode.toString();
    expect(actual).toContain('body.classList.toggle');
    expect(actual).toContain('dark-mode-theme');
  });
});
