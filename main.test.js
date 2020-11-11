const { JSDOM } = require('jsdom');
const {
  toBeInTheDocument,
  toBeEmptyDOMElement,
  toHaveStyle,
  toHaveAttribute,
  toHaveClass,
} = require('@testing-library/jest-dom/matchers');

const { fireEvent } = require('@testing-library/dom');

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
  it('should contain the correct CSS variables and values at the root level of the CSS', async () => {
    const variables = [
      '--primary-colour',
      '--secondary-colour',
      '--text-colour',
      '--header-size',
      '--border-radius',
    ];
    const values = [
      'rgb(197, 231, 147)',
      'antiquewhite',
      'black',
      '24px',
      '10px',
    ];
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === ':root'
    );
    variables.forEach((variable, i) => {
      expect(style[variable]).toBe(values[i]);
    });
  });
  it('should use the CSS variables in the correct places in the CSS - main', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'main'
    );
    expect(style[`font-size`]).toBe(`var(--main-text-size)`);
  });
  it('should use the CSS variables in the correct places in the CSS - body', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'body'
    );
    expect(style[`color`]).toBe(`var(--text-colour)`);
    expect(style[`background-color`]).toBe(`var(--secondary-colour)`);
  });
  it('should use the CSS variables in the correct places in the CSS - button', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'button'
    );
    expect(style[`font-size`]).toBe(`var(--main-text-size)`);
    expect(style[`border-radius`]).toBe(`var(--border-radius)`);
  });
  it('should use the CSS variables in the correct places in the CSS - .plant-header', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.plant-header'
    );
    expect(style[`font-size`]).toBe(`var(--header-size)`);
  });
  it('should use the CSS variables in the correct places in the CSS - .plant-listing', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.plant-listing'
    );
    expect(style[`background-color`]).toBe(`var(--primary-colour)`);
    expect(style[`border-radius`]).toBe(`var(--border-radius)`);
  });
  it('should use the CSS variables in the correct places in the CSS - .plant-pic', () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === '.plant-pic'
    );
    expect(style[`border-radius`]).toBe(`var(--border-radius)`);
  });
});

describe(LEVELS.two, () => {
  it(`should not change font-size in main css`, async () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'main'
    );
    expect(style[`font-size`]).not.toBe('18px');
  });
  it(`should have the value of main-text-size be 18px`, async () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === ':root'
    );
    expect(style['--main-text-size']).toBe('18px');
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
    const darkModeButton = document.querySelector('#dark-mode-button');

    fireEvent.click(darkModeButton);

    const body = document.querySelector('body');
    expect(body).toHaveClass('dark-mode-theme');
  });
});
