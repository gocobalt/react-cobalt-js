# react-cobalt-js

> Cobalt frontend SDK

[![NPM](https://img.shields.io/npm/v/@cobaltio/react-cobalt-js.svg)](https://www.npmjs.com/package/@cobaltio/react-cobalt-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @cobaltio/react-cobalt-js
```

## Usage

```jsx
// import Provider & Config components
import { Provider, Config } from "@cobaltio/react-cobalt-js";

// Config component needs to be wrapped inside the Provider component.
// And pass the Cobalt session token (that you generated using the Cobalt backend SDK) to the provider.
<Provider sessionToken={ cobaltToken }>
    {
        // ideally you'd render the Config component inside a modal.
        // the component only gets rendered when `slug` is passed.
        <Config
            id="SOME_UNIQUE_CONFIG_ID" // Optional
            slug="APP_SLUG" // application type / slug
            // dynamic labels payload (optional)
            labels={{ /* PAYLOAD */ }}
            // you can override the component's container style if you want
            style={{
                borderRadius: 8,
                maxWidth: 450,
            }}
        />
    }
</Provider>
```

### Example

For an example implementation, you can check out the [`App.js` file](/example/src/App.js)
in the [`example`](/example/) directory.
