# functionality
Webpack bundler with support for:
- react and react-router
- redux
- babel-eslint and stylelint
- html, css, and js minification

# linting
stylelint rules doc:  https://stylelint.io/user-guide/rules/  (edit .stylelintrc)

eslint rules doc:  https://eslint.org/docs/rules/  (edit .eslintrc)

# setup
### Install modules:
```
npm install
```

### To run local dev environment (includes linting):
```
npm run dev
```

### Production build:
```
npm run build
```
Resulting deployable build will be located in /dist/ folder in project root

### Serve:
```
npm run serve
```
Serves up contents of /dist/ at localhost:8000
