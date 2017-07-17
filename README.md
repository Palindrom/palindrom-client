# &lt;palindrom-polymer&gt; [![Build Status](https://travis-ci.org/Palindrom/palindrom-polymer.svg?branch=gh-pages)](https://travis-ci.org/Palindrom/palindrom-polymer)
---
> Data binding with [&lt;palindrom-connection&gt;](https://github.com/Palindrom/palindrom-connection) via DOM events.

Custom Element that binds [&lt;palindrom-connection&gt;](https://github.com/Palindrom/palindrom-connection) with [Polymer's template binding](https://www.polymer-project.org/1.0/docs/devguide/templates.html).
That keeps your Polymer app, or just `dom-bind` template in sync with any server-side
data-model using Palindrom & [JSON Patch](https://tools.ietf.org/html/rfc6902) flow.

You get three-way data binding server - JS - HTML, kept in flawless sync.
```html
<palindrom-connection remote-url='/palindom'></palindrom-connection>
<palindrom-polymer obj="{{model}}"></palindrom-polymer>
```

## Demo

- [Check it live!](http://Palindrom.github.io/palindrom-polymer/demo)
- [test suite](http://Palindrom.github.io/palindrom-polymer/test)


## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install palindrom-polymer --save
```

Or [download as ZIP](https://github.com/Palindrom/palindrom-polymer/archive/master.zip).

## Usage

1. Import Web Components' polyfill, if needed:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/palindrom-polymer/palindrom-polymer.html">
    ```

3. Start using it!

    ```html
    <palindrom-connection remote-url='/palindom'></palindrom-connection>
    <palindrom-polymer obj="{{model}}"></palindrom-polymer>
    ```
    It handles `palindrom-connection` events and channels them to the bound Polymer element(s). Also, all the changes made inside those bound Polymer elements are sent to the server via WebSocket or HTTP, as
    [JSON Patch](https://tools.ietf.org/html/rfc6902)es.
    All the changes from server are also received and propagated to your HTML via events from `palindrom-connection`.

## Attributes & Properties


Attribute                       | Options   | Default | Description
---                             | ---       | ---     | ---
ref   | `String` or `HTMLElement` | element itself | To which element (polymer element/`template is="dom-bind"`) we should bind to.
target   | `CSS Selector String` | `palindrom-connection` | The CSS selector of the `palindrom-connection` element.
obj | `Object` | `{}` | Object that will be synced

## Template binding issues

Polymer template binding is [known to have problems with arrays](https://github.com/Polymer/polymer/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+splice). They do not affect communication/syncing data with Palindrom. However, we found out that one affecting arrays of primitives (like [Polymer/polymer#3682](https://github.com/Polymer/polymer/issues/3682)) results in surprising artifacts with HTML rendering. Therefore, until Polymer fixes that, we suggest to avoid manipulations on such arrays.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Development and Testing

In order to develop it locally we suggest to use [polyserve](https://npmjs.com/polyserve) tool to handle bower paths gently.

1. Install the global NPM modules [bower](http://bower.io/) & [polyserve](https://npmjs.com/polyserve): `npm install -g bower polyserve`
2. Make a local clone of this repo: `git clone git@github.com:Palindrom/palindrom-polymer.git`
3. Go to the directory: `cd palindrom-polymer`
4. Install the local dependencies: `bower install`
5. Start the development server: `polyserve -p 8000`
6. Open the demo: [http://localhost:8000/components/palindrom-polymer/](http://localhost:8000/components/palindrom-polymer/)
7. Open the test suite: [http://localhost:8000/components/palindrom-polymer/test/](http://localhost:8000/components/palindrom-polymer/test/)

## History

For detailed changelog, check [Releases](https://github.com/Palindrom/palindrom-polymer/releases).

## License

MIT
