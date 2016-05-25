(function() {
  var serverVersionNumber = 0;


  WebSocket = function FakeWebSocket(){
    this.readyState = 1;
  };
  var full = {
    user: {
      fullName: "",
      firstName$: "",
      lastName$: "",
      resetNameClicked$: false
    }
  };

  function handlePageLoad(url) {
    if (url.indexOf('subpage.html') > -1) {
      full.user.firstName$ = 'Nikola';
      full.user.lastName$ = 'Tesla';
      full.user.fullName = 'Nikola Tesla';
    }
    else { //index.html
      full.user.firstName$ = 'Albert';
      full.user.lastName$ = 'Einstein';
      full.user.fullName = 'Albert Einstein';
    }
  }

  var lastUrl = window.location.href;
  handlePageLoad(lastUrl);

  // pass-through all requests that are not meant for puppet
  sinon.FakeXMLHttpRequest.useFilters = true;
  sinon.FakeXMLHttpRequest.addFilter(function (method, url) {
    return !(/.*puppet$/.test(url));
  });

  var sinonFakeServer = sinon.fakeServer.create();

  sinonFakeServer.respondWith(function(request) {
    if(request.requestHeaders['Accept'] == 'application/json') {
      request.respond(200, [{name: "Location", value: this.url},{name: "X-Referer", value: lastUrl}], JSON.stringify(full));
    } else if(request.requestHeaders['Accept'] == 'application/json-patch+json') {
      var outPatches = [];
      handlePageLoad(this.url);
      serverVersionNumber++;
      outPatches.push({op: 'replace', path: '/_ver#s', value: serverVersionNumber});
      outPatches.push({op: 'test', path: '/_ver#c$', value: full.user.firstName$});
      outPatches.push({op: 'replace', path: '/user/firstName$', value: full.user.firstName$});
      outPatches.push({op: 'replace', path: '/user/lastName$', value: full.user.lastName$});
      outPatches.push({op: 'replace', path: '/user/fullName', value: full.user.fullName});
      request.respond(200, [], JSON.stringify(outPatches));
    } else {
      throw new Error("unexpected request - url matches puppet (=" + request.url + "), yet Accept header is not json nor json patch (=" + request.requestHeaders['Accept'] + ")");
    }
  });

  WebSocket.prototype.send = function (data) {
    console.info("Mock WebSocket .send ",data);
      var inPatches = data ? JSON.parse(data) : [];
      var outPatches = [];

      var clientReplaceVersion = inPatches.shift();
      var serverVersionForOT = inPatches.shift(); // disregard

      serverVersionNumber++;
      outPatches.push({op: 'replace', path: '/_ver#s', value: serverVersionNumber});
      outPatches.push({op: 'test', path: '/_ver#c$', value: clientReplaceVersion.value});

      jsonpatch.apply(full, inPatches);


      inPatches.forEach(function (patch) {
        if (patch.op == "replace" &&
          (patch.path == "/user/firstName$" || patch.path == "/user/lastName$")
          ) {
          full.user.fullName = full.user.firstName$ + ' ' + full.user.lastName$;
          outPatches.push({op: 'replace', path: '/user/fullName', value: full.user.fullName});
        }
        if (patch.op == "replace" &&
          (patch.path == "/user/resetNameClicked$" && patch.value === "true")
          ) {
          full.user.firstName$ = "Isaac";
          full.user.lastName$ = "Newton";
          full.user.fullName = full.user.firstName$ + ' ' + full.user.lastName$;
          outPatches.push({op: 'replace', path: '/user/firstName$', value: full.user.firstName$});
          outPatches.push({op: 'replace', path: '/user/lastName$', value: full.user.lastName$});
          outPatches.push({op: 'replace', path: '/user/fullName', value: full.user.fullName});
        }
      });


    console.info("Mock WebSocket message data:", outPatches);
    var that = this;
    setTimeout(function () {
      that.onmessage({data: JSON.stringify(outPatches) });
    }, 10);
  };
})();