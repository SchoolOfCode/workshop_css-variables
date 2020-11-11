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
      expect(style[variable] == values[i]).toBeTruthy();
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
  it(`should not change font-size in main css`, async () => {
    const { style } = Array.from(document.styleSheets[0].cssRules).find(
      ({ selectorText }) => selectorText === 'main'
    );
    expect(style[`font-size`] == `18px`).not.toBeTruthy();
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
