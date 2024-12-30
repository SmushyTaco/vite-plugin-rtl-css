# Vite Plugin Rtl Css

Vite plugin for rtlcss

## Installation

```shell
$ npm install vite-plugin-rtl-css --save-dev
```

## Usage

```ts
import { defineConfig } from 'vite';
import viteRtlCssPlugin from 'vite-plugin-rtl-css';

export default defineConfig({
    plugins: [viteRtlCssPlugin()]
});

```

This will transform css files to their rtl counterparts. Look below for options

## Options

```ts
viteRtlCssPlugin({
    fileNameMap: {
        '.css': '[name].rtl.css',
        '.min.css': '[name].rtl.min.css'
    },
    sourceMap: true,
    rtlcssConfig: {
        autoRename: true
    }
});
```

* `fileNameMap` is an optional parameter that specifies a map of file extensions to templates for rtl css generation. What's seen in the example is the default.
* `sourceMap` is an optional parameter that specifies if sourcemaps should be generated. If this isn't specified it'll default to `build.sourcemap` from your `vite.config.ts`.
* `rtlcssConfig` is an optional parameter that comes from the `rtlcss` package that's used by this plugin to configure `rtlcss`.
