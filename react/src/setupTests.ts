// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
    // to ensure any components using the translation hook can use the functions without a warning being shown
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            exists: () => true,
        },
    }),
}));

jest.mock("../src/common/helper/HttpRequest");

global.beforeEach(() => {
    // Resolves test run issue "TypeError: e.createSVGMatrix is not a function",
    // causes by Raphael.js accessing non-existing SVG functions during test run
    Object.defineProperty(global.SVGSVGElement.prototype, "createSVGMatrix", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
            matrix: jest.fn(() => [[]]),
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            e: 0,
            f: 0,
            flipX: jest.fn(),
            flipY: jest.fn(),
            inverse: jest.fn(),
            multiply: jest.fn(),
            rotate: jest.fn(),
            rotateFromVector: jest.fn(),
            scale: jest.fn(),
            scaleNonUniform: jest.fn(),
            skewX: jest.fn(),
            skewY: jest.fn(),
            translate: jest.fn(),
        })),
    });

    // Resolves test run issue "ReferenceError: SVGTextElement is not defined"
    class SVGTextElement extends HTMLElement {}
    // Note: Type checks does not really matter here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.SVGTextElement = SVGTextElement as any;
});
