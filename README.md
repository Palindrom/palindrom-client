
# &lt;puppet-polymer-client&gt; [![Build Status](https://travis-ci.org/PuppetJs/puppet-polymer-client.svg?branch=gh-pages)](https://travis-ci.org/PuppetJs/puppet-polymer-client)
> Three-way data binding server - JS - HTML kept in flawless sync with JSON Patch, WebSockets/HTTP.

Custom Element that binds [PuppetJs](https://github.com/PuppetJs/PuppetJs) with [Polymer's template binding](https://www.polymer-project.org/1.0/docs/devguide/templates.html).
That keeps your Polymer app, or just `dom-bind` template in sync with any server-side
data-model using Puppet & [JSON Patch](https://tools.ietf.org/html/rfc6902) flow.

You get three-way data binding server - JS - HTML, kept in flawless sync.

    <puppet-client
        obj="{{model}}"></puppet-client>




## Demo

- [Check it live!](http://PuppetJs.github.io/puppet-polymer-client/demo)
- [test suite](http://PuppetJs.github.io/puppet-polymer-client/test)


## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install puppet-polymer-client --save
```

Or [download as ZIP](https://github.com/PuppetJs/puppet-polymer-client/archive/gh-pages.zip).

## Usage

1. Import Web Components' polyfill, if needed:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/puppet-polymer-client/puppet-client.html">
    ```

3. Start using it!

    ```html
    <puppet-client obj="{{model}}"></puppet-client>
    ```
    It establishes the PuppetJs connection when attached. All the changes made
    in browser are sent to the server via WebSocket or HTTP, as
    [JSON Patch](https://tools.ietf.org/html/rfc6902)es.
    All the changes from server are also received and propagated to your HTML.

## Attributes & Properties


Attribute                       | Options   | Default | Description
---                             | ---       | ---     | ---
ref   | `String` or `HTMLElement` | element itself | To which element (polymer element/`template is="dom-bind"`) we should bind to.
debug | `Boolean` | `false` | Set to `true` to enable debugging mode
ignoreAdd | `RegExp` | `/.*/` | Regular expression with local properties to ignore
listenTo | `String` | `document.body` | DOM node to listen to (see PuppetDOM listenTo attribute)
localVersionPath | `JSONPointer` | `/_ver#c$` | local version path, set to falsy do disable Versioned JSON Patch communication
obj | `Object` | `{}` | **notifies** Object that will be synced
ot | `Boolean` | `true` | `false` to disable OT
path | `String` | `/` | Path to given obj
pingIntervalS | `Number` | `5` | Interval in seconds between heartbeat patches, `0` - disable heartbeat
purity | `Boolean` | `false` | `true` to enable purist mode of OT
remote-url / remoteUrl | `String` | `window.location` | The remote's URL
remoteVersionPath | `JSONPointer` | `/_ver#s` | remote version path, set it to falsy to disable Double Versioned JSON Patch communication
useWebSocket | `Boolean` | `true` | Set to false to disable WebSocket (use HTTP)

## Events

Name                       | Description
---                             | ---     
patch-applied | Fired when patch gets applied
patchreceived | Fired when patch gets received
patchsent | Fired when patch gets send
socketstatechanged | Fired when web socket state changes
connectionerror | Fired when unrecoverable connection error happens
reconnection-countdown | Fired when reconnecting. has `milliseconds` property in details, denoting number of milliseconds to scheduled reconnection
reconnection-end | Fired after successful reconnection

:warning: Please note, that Polymer applies changes (especially array ones) asynchronously, so those could happen after `patch-applied` event was triggered.

## Reconnection and heartbeats

See [puppetjs docs](https://github.com/puppetjs/puppetjs#heartbeat-and-reconnection).
`pingIntervalS` is directly forwarded to puppetjs, `reconnection-countdown` and `reconnection-end` events are directly based on respective callbacks.

## Template binding issues

Polymer template binding is [known to have problems with arrays](https://github.com/Polymer/polymer/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+splice). They do not affect communication/syncing data with Puppet. However, we found out that one affecting arrays of primitives (like [Polymer/polymer#3682](https://github.com/Polymer/polymer/issues/3682)) results in surprising artifacts with HTML rendering. Therefore, until Polymer fixes that, we suggest to avoid manipulations on such arrays.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Development and Testing

In order to develop it locally we suggest to use [polyserve](https://npmjs.com/polyserve) tool to handle bower paths gently.

1. Install the global NPM modules [bower](http://bower.io/) & [polyserve](https://npmjs.com/polyserve): `npm install -g bower polyserve`
2. Make a local clone of this repo: `git clone git@github.com:PuppetJs/puppet-polymer-client.git`
3. Go to the directory: `cd puppet-polymer-client`
4. Install the local dependencies: `bower install`
5. Start the development server: `polyserve -p 8000`
6. Open the demo: [http://localhost:8000/components/puppet-polymer-client/](http://localhost:8000/components/puppet-polymer-client/)
7. Open the test suite: [http://localhost:8000/components/puppet-polymer-client/test/](http://localhost:8000/components/puppet-polymer-client/test/)

## History

For detailed changelog, check [Releases](https://github.com/PuppetJs/puppet-polymer-client/releases).

## License

MIT
