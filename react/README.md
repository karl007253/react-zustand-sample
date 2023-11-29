# Frontend Framework Documentation

Helpful information about the usage of this frontend framework

---

## Contents

1. [Directory Structure](#markdown-header-directory-structure)
2. [Packages Installed](#markdown-header-packages-installed)
3. [Guideline for Packages](#markdown-header-guideline-for-packages)
    - [Rules of ESLint & Prettier](#markdown-header-rules-of-eslint-prettier)
    - [Sass](#markdown-header-sass)
    - [React Router](#markdown-header-react-router)
    - [Localization](#markdown-header-localization)
    - [Zustand - State Management](#markdown-header-zustand-state-management)
    - [Unit Testing](#markdown-header-unit-testing)

---

## Directory Structure

-   .husky (_Git hooks_)
-   public (_Root folder that gets served up as our react app_)
    -   locales (_Locales JSON files loaded using http_)
        -   en.json (_Locales JSON file for EN. By default, only EN is supported_)
    -   favicon.ico (_Icon file_)
    -   index.html (_Main HTML template that includes React code and provides a context for React to render to_)
    -   logo192.png (_App logo in dimension of 192\*192 px_)
    -   logo512.png (_App logo in dimension of 512\*512 px_)
    -   manifest.json (_Metadata used by mobile phones to add web app to home screen of a device. Part of PWA_)
    -   robots.txt (_Rules for spiders, crawlers and scrapers for accessing your app_)
-   src (_Folder where we write almost all the codes_)
    -   common (_Reusable codes_)
        -   assets (_Static resources used in the application, such as images, CSS files, documents etc._)
            -   images (_Images used in the application_)
            -   sass (_Stylesheets written in Sass_)
                -   component (_Stylesheets for a specific component, such as button, dropdown, etc._)
                -   layout (_Stylesheets for main parts of a site, such as header, footer, etc._)
                -   page (_Stylesheets for a specific page in the application_)
                -   utils (_Sass tools_)
                    -   functions (_Sass functions_)
                    -   mixins (_Sass mixins_)
                    -   variables (_Sass variables_)
                -   main.scss (_Global configuration of Sass_)
        -   component (_Reusable component_)
        -   data (_Reusable data_)
        -   helper (_Helper functions / classes. Note: helper contains only first level files_)
        -   hooks (_Custom React hooks_)
        -   layout (_Shared component to define common section across multiple pages_)
        -   library (_A group of helper relates to each other. Note: library's first level contains only folder_)
        -   localization (_Localization_)
            -   i18n.ts (_Config file of localization in the application_)
        -   route (_Route wrappers_)
        -   zustand (_State management_)
            -   interface (_Interfaces used by slices_)
            -   slice (_Slices. A slice consists of the initial state, reducers and actions._)
            -   store.ts (_Entry point for state store_)
    -   page (_Pages in the application_)
    -   App.tsx (_First component of the application_)
    -   index.tsx (_Entry point of React application_)
    -   react-app-env.d.ts (_TypeScript types declarations that are specific to projects started with Create React App. Note: Do not remove the react-app-env.d.ts file to avoid errors_)
    -   Route.tsx (_Routes of the application_)
    -   setupTests.ts (_Global setup for test_)
-   .eslintignore (_Files and directories that are ignored by ESLint_)
-   .eslintrc.json (_ESLint configuration file_)
-   .prettierignore (_Files and directories that are ignored by Prettier_)
-   .prettierrc.json (_Prettier configuration file_)
-   package.json (_Metadata, dependencies, scripts required for the application_)
-   package-lock.json (_Ensuring consistency in packages installation across various machines and environments_)
-   tsconfig.json (_Typescript configuration file_)

---

## Packages Installed

These are the packages specifically used in this project:

1. Bootstrap

    - [bootstrap][site-packages-bootstrap]
    - [react-bootstrap][site-packages-react-bootstrap]

    ```npm
    npm install boostrap react-boostrap
    ```

2. [react-toastify][site-packages-react-toastify]

    ```npm
    npm install react-toastify
    ```

3. [nanoid][site-packages-nanoid]

    ```npm
    npm install nanoid
    ```

4. [rc-tree][site-packages-rctree]

    ```npm
    npm install rc-tree
    ```

5. [formik][site-packages-formik]

    ```npm
    npm install formik
    ```

6. [yup][site-packages-yup]

    ```npm
    npm install yup
    ```

7. [immer][site-packages-immer]

    ```npm
    npm install immer
    ```

8. [@types/lodash][site-packages-types-lodash]

    ```npm
    npm install @types/lodash
    ```

9. [cross-env][site-packages-cross-env]

    ```npm
    npm install cross-env --save-dev
    ```

10. [bootstrap-switch-button-react](site-packages-bootstrap-switch-button-react)

    ```npm
    npm install bootstrap-switch-button-react
    ```

11. [raphael][site-packages-raphael]

    ```npm
    npm install raphael
    ```

12. [@types/raphael][site-packages-types-raphael]

    ```npm
    npm install @types/raphael
    ```

13. [dnd-kit][site-packages-dnd-kit]

    ```npm
    npm i @dnd-kit/core
    ```

14. [dnd-kit-sortable][site-packages-dnd-kit-sortable]

    ```npm
    npm i @dnd-kit/sortable
    ```

15. [dnd-kit-utilities][site-packages-dnd-kit-utilities]

    ```npm
    npm i @dnd-kit/utilities
    ```

16. [react-window][site-packages-react-window]

    ```npm
    npm i react-window
    ```

17. [@types/react-window][site-packages-types-react-window]

    ```npm
    npm i @types/react-window
    ```

---

## Guideline for Packages

### Rules of ESLint & Prettier

##### ESLint

| Rule                                                                                                                                                                                    | Description                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ["react/jsx-filename-extension": ["warn", {"extensions": [".tsx"]}]][site-rules-eslint-react-jsx-filename-extension]                                                                    | To allow JSX in files with extension ‘.tsx’                                                           |
| ["import/extensions": ["error", "ignorePackages", {"ts": "never", "tsx": "never"}]][site-rules-eslint-import-extensions]                                                                | To fix error of missing file extension “tsx”                                                          |
| ["react/function-component-definition": ["error", {"namedComponents": "arrow-function", "unnamedComponents": "arrow-function"}]][site-rules-eslint-react-function-component-definition] | To enforce arrow function is used for named components and unnamed components                         |
| ["no-plusplus": ["error", {"allowForLoopAfterthoughts": true}]][site-rules-eslint-no-plusplus]                                                                                          | To allows unary operators ++ and -- in the afterthought (final expression) of a for loop              |
| ["arrow-body-style": "off"][site-rules-eslint-arrow-body-style]                                                                                                                         | To disable the checking of requiring braces around arrow function bodies                              |
| ["@typescript-eslint/no-unused-vars": "error"][site-rules-eslint-typescript-eslint-no-unused-vars]                                                                                      | To disallow unused variables                                                                          |
| ["no-shadow": "off" <br /> "@typescript-eslint/no-shadow": ["error"]][site-rules-eslint-typescript-eslint-no-shadow]                                                                    | To eliminate shadowed variable declarations                                                           |
| ["react/require-default-props": "off"][site-rules-eslint-react-require-default-props]                                                                                                   | To turn off checking on defaultProps                                                                  |
| ["no-param-reassign": ["error", {"props": true, "ignorePropertyModificationsFor": ["draft"]}]][site-rules-eslint-no-param-reassign]                                                     | To disallow reassigning function parameters, except for "draft" property which is being used in immer |

##### Prettier

| Rule                                                         | Description                                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| ["trailingComma": "es5"][site-rules-prettier-trailing-comma] | To print trailing commas where valid in ES5 (objects, arrays, etc.). No trailing commas in type parameters in TypeScript |
| ["tabWidth": 4][site-rules-prettier-tab-width]               | To specify **4** as the number of spaces per indentation-level                                                           |
| ["semi": true][site-rules-prettier-semi]                     | To add a semicolon at the end of every statement                                                                         |
| ["singleQuote": false][site-rules-prettier-single-quote]     | To enforce the usage of double quote over single quote                                                                   |

---

### Sass

Please refer to Sass official site:

-   [Sass: Sass Basics][site-official-sass-basics]
-   [Sass: Documentation][site-official-sass-documentation]

---

### React Router

-   Official documentation: [React Router | Docs Home][site-official-react-router-v6]
-   All the routes in the application must be configured in [src/Route.tsx](react/src/Route.tsx)

##### Example:

```typescript
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Blog from "./page/Blog";

export default () => {
    return (
        <Routes>
            {/* navigate to root path when no other route matches the URL */}
            <Route path="*" element={<Navigate to="/" />} />

            {/* render Home page when root path is matched */}
            <Route path="/" element={<Home />} />

            {/* render Blog page when "/blog" path is matched */}
            <Route path="/blog" element={<Blog />} />
        </Routes>
    );
};
```

---

### Localization

-   Official documentation: [Introduction - react-i18next documentation][site-official-react-i18next]
-   By default, only **EN** is supported.
-   All the locales must be written in [public/locales/en.json](react/public/locales/en.json).
-   `useTranslation()` is used to get the text from locales file.

##### Example:

##### public/locales/en.json

```json
{
    "app": {
        "name": "Framework Base - React"
    }
}
```

##### Home.tsx

```typescript
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>Welcome to {t("app.name")}</h1>
        </div>
    );
};

export default Home;
```

---

### Zustand - State Management

-   Official documentation: [GitHub - pmndrs/zustand: 🐻 Bear necessities for state management in React][site-official-zustand]
-   Steps to create a slice:
    1.  create slice related interface(s) in [src/common/zustand/interface](react/src/common/zustand/interface).
    2.  create slices in [src/common/zustand/slice](react/src/common/zustand/slice).
    3.  state the created slices in [src/common/zustand/Store.ts](react/src/common/zustand/Store.ts).

##### Example

##### src/common/zustand/interface/UserInterface.ts

```typescript
interface User {
    id: number;
    name: string;
}

interface UserSlice {
    users: User[];

    addUser: (user: User) => void;

    removeUser: (id: number) => void;
}

export default UserSlice;
```

##### src/common/zustand/slice/UserSlice.ts

```typescript
import { StateCreator } from "zustand";
import UserSlice from "../interface/UserInterface";

const createUserSlice: StateCreator<
    UserSlice,
    [["zustand/devtools", never]]
> = (setState, getState) => ({
    users: [
        { id: 1, name: "Tom" },
        { id: 2, name: "Jerry" },
    ],

    addUser: (user) => {
        setState(
            {
                users: [...getState().users, user],
            },
            false,
            "addUser"
        );
    },

    removeUser: (id) => {
        setState(
            {
                users: getState().users.filter((user) => user.id !== id),
            },
            false,
            "removeUser"
        );
    },
});

export default createUserSlice;
```

##### src/common/zustand/Store.ts

```typescript
import create from "zustand";
import { devtools } from "zustand/middleware";
import UserSlice from "./interface/UserInterface";
import ProductSlice from "./interface/ProductInterface";
import createUserSlice from "./slice/UserSlice";
import createProductSlice from "./slice/ProductSlice";

// to create store with all the slices
const useStore = create<UserSlice & ProductSlice>()(
    devtools((...data) => ({
        ...createUserSlice(...data),
        ...createProductSlice(...data),
    }))
);

export default useStore;
```

##### To use the created store

```typescript
import useStore from "../common/zustand/Store";

const Home = () => {
    // get state & functions from Zustand store
    const { users, removeUser, addUser } = useStore((state) => ({
        users: state.users,
        removeUser: state.removeUser,
        addUser: state.addUser,
    }));

    return (
        <div>
            <button
                type="button"
                onClick={() => addUser({ id: 3, name: "test" })}
            >
                Add
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Remove User</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => removeUser(user.id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
```

---

### Unit Testing

-   References:
    -   [Running Tests | Create React App][site-official-create-react-app-running-tests]
    -   [Introduction | Testing Library][site-official-testing-library]
-   Unit testing strategies:
    -   perform for basic React components
    -   testing file is placed in the same folder of the component
    -   check for the existence of elements required, such as visible contents, links, etc.
    -   check for the necessary actions in first level
    -   check only for the key of locales
-   Run `npm run test` to trigger test

##### Example

##### public/locales/en.json

```json
{
    "header": {
        "title": "Framework Base - React",
        "button": {
            "login": "Login"
        }
    }
}
```

##### src/common/component/Header.tsx

```typescript
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/images/logo192.png";

const Header = () => {
    const { t } = useTranslation();

    const handleLogin = () => {
        alert("Login Successfully");
    };

    return (
        <header>
            <Link to="/home">
                <img src={logo} alt="logo" />
            </Link>

            <h1>{t("header.title")}</h1>

            <button type="button" onClick={handleLogin}>
                {t("header.button.login")}
            </button>
        </header>
    );
};

export default Header;
```

##### src/common/component/Header.test.tsx

```typescript
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

describe("Header", () => {
    beforeEach(() => {
        render(<Header />, { wrapper: MemoryRouter });
    });

    it("should have an app icon with the link of home page", () => {
        expect(screen.getByRole("link", { name: /logo/i })).toHaveAttribute(
            "href",
            "/home"
        );
    });

    it("should have a title", () => {
        expect(
            screen.getByRole("heading", { name: "header.title" })
        ).toBeInTheDocument();
    });

    it("should have a button that trigger an alert", async () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation();
        await userEvent.click(
            screen.getByRole("button", { name: "header.button.login" })
        );

        expect(alertMock).toHaveBeenCalledTimes(1);
    });
});
```

[site-rules-eslint-react-jsx-filename-extension]: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
[site-rules-eslint-import-extensions]: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
[site-rules-eslint-react-function-component-definition]: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
[site-rules-eslint-no-plusplus]: https://eslint.org/docs/latest/rules/no-plusplus
[site-rules-eslint-arrow-body-style]: https://eslint.org/docs/latest/rules/arrow-body-style
[site-rules-eslint-typescript-eslint-no-unused-vars]: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md
[site-rules-eslint-typescript-eslint-no-shadow]: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-shadow.md
[site-rules-eslint-react-require-default-props]: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
[site-rules-prettier-trailing-comma]: https://prettier.io/docs/en/options.html#trailing-commas
[site-rules-prettier-tab-width]: https://prettier.io/docs/en/options.html#tab-width
[site-rules-prettier-semi]: https://prettier.io/docs/en/options.html#semicolons
[site-rules-prettier-single-quote]: https://prettier.io/docs/en/options.html#quotes
[site-official-sass-basics]: https://sass-lang.com/guide
[site-official-sass-documentation]: https://sass-lang.com/documentation/
[site-official-react-router-v6]: https://reactrouter.com/docs/en/v6
[site-official-react-i18next]: https://react.i18next.com/
[site-official-zustand]: https://github.com/pmndrs/zustand
[site-official-create-react-app-running-tests]: https://create-react-app.dev/docs/running-tests
[site-official-testing-library]: https://testing-library.com/docs/
[site-packages-bootstrap]: https://github.com/twbs/bootstrap
[site-packages-react-bootstrap]: https://github.com/react-bootstrap/react-bootstrap
[site-packages-react-toastify]: https://github.com/fkhadra/react-toastify
[site-packages-nanoid]: https://github.com/ai/nanoid
[site-packages-rctree]: https://github.com/react-component/tree
[site-packages-formik]: https://github.com/formium/formik
[site-packages-yup]: https://github.com/jquense/yup
[site-packages-immer]: https://github.com/immerjs/immer
[site-packages-types-lodash]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/lodash
[site-packages-cross-env]: https://github.com/kentcdodds/cross-env
[site-packages-bootstrap-switch-button-react]: https://github.com/gitbrent/bootstrap-switch-button-react
[site-packages-raphael]: https://github.com/DmitryBaranovskiy/raphael
[site-packages-types-raphael]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/raphael
[site-packages-react-window]: https://github.com/bvaughn/react-window
[site-packages-types-react-window]: https://github.com/DefinitelyTyped/DefinitelyTyped
[site-packages-dnd-kit]: https://github.com/clauderic/dnd-kit
[site-packages-dnd-kit-sortable]: https://github.com/clauderic/dnd-kit
[site-packages-dnd-kit-utilities]: https://github.com/clauderic/dnd-kit
