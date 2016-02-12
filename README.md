
# &lt;puppet-polymer-client&gt;
> Three-way data binding server - JS - HTML kept in flawless sync with JSON Patch, WebSockets/HTTP.

Custom Element that binds [PuppetJs](https://github.com/PuppetJs/PuppetJs) with [Polymer's template binding](https://www.polymer-project.org/1.0/docs/devguide/templates.html).
That keeps your Polymer app, or just `dom-bind` template in sync with any server-side
data-model using Puppet & [JSON Patch](https://tools.ietf.org/html/rfc6902) flow.

You get three-way data binding server - JS - HTML, kept in flawless sync.

    <puppet-client
        obj="{{model}}"></puppet-client>




## Demo

- [Check it live!](http://PuppetJs.github.io/puppet-polymer-client)
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

## Properties


Attribute                       | Options   | Default | Description
---                             | ---       | ---     | ---
debug | Boolean | `false` | Set to `true` to enable debugging mode
ignoreAdd | RegExp | `/.*/` | Regular expression with local properties to ignore
listenTo | String | `document.body` | DOM node to listen to (see PuppetDOM listenTo attribute)
localVersionPath | JSONPointer | `/_ver#c$` | local version path, set to falsy do disable Versioned JSON Patch communication
obj | Object | `{}` | **notifies** Object that will be synced
ot | Boolean | `true` | `false` to disable OT
path | String | `/` | Path to given obj
pingInterval | Number | `60` | Interval in seconds between ping patches, `0` - disable ping patches
purity | Boolean | `false` | `true` to enable purist mode of OT
remoteUrl | String | `window.location` | The remote's URL
remoteVersionPath | JSONPointer | `/_ver#s` | remote version path, set it to falsy to disable Double Versioned JSON Patch communication
useWebSocket | Boolean | `true` | Set to false to disable WebSocket (use HTTP)


## Events

Name                       | Description
---                             | ---     
patch-applied | Fired when patch gets applied
patchreceived | Fired when patch gets applied
patchsent | Fired when patch gets applied
socketstatechanged | Fired when patch gets applied
connectionerror | Fired when patch gets applied

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/PuppetJs/puppet-polymer-client/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)
