# functionality
Webpack bundler with support for:
- react and react-router
- redux and thunk middleware
- babel-eslint
- html, css, and js minification

# linting
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
Serves up contents of /dist/ at localhost:8080
