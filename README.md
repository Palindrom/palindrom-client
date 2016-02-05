
<!---

This README is automatically generated from the comments in these files:
puppet-polymer-client.html  iron-request.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build Status](https://travis-ci.org/PolymerElements/puppet-polymer-client.svg?branch=master)](https://travis-ci.org/PolymerElements/puppet-polymer-client)

_[Demo and API Docs](https://elements.polymer-project.org/elements/puppet-polymer-client)_


##&lt;puppet-polymer-client&gt;

The `puppet-polymer-client` element exposes network request functionality.

```html
<puppet-polymer-client
    auto
    url="http://gdata.youtube.com/feeds/api/videos/"
    params='{"alt":"json", "q":"chrome"}'
    handle-as="json"
    on-response="handleResponse"
    debounce-duration="300"></puppet-polymer-client>
```

With `auto` set to `true`, the element performs a request whenever
its `url`, `params` or `body` properties are changed. Automatically generated
requests will be debounced in the case that multiple attributes are changed
sequentially.

Note: The `params` attribute must be double quoted JSON.

You can trigger a request explicitly by calling `generateRequest` on the
element.



##&lt;iron-request&gt;

iron-request can be used to perform XMLHttpRequests.

```html
<iron-request id="xhr"></iron-request>
...
this.$.xhr.send({url: url, params: params});
```
