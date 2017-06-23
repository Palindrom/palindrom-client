(function() {
  var serverVersionNumber = 0,
      clientVersionNumber = 0,
      enableServerReplies = true;

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
  
  window.setMockServerModel = function (model) {
    full = model;
  };
  
  window.preparePatchFromMockServer = function(patch) {
    var setVersionOp = {op: "replace", path: "/_ver#s$", value: ++serverVersionNumber};
    return [setVersionOp,{value: clientVersionNumber, op:"test", path:"/_ver#c"}].concat(patch);
  };

  window.disableMockServerReplies = function() {
    enableServerReplies = false;
  };

  window.lastRequestContent;

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



  // pass-through all requests that are not meant for palindrom
  sinon.FakeXMLHttpRequest.useFilters = true;
  sinon.FakeXMLHttpRequest.addFilter(function (method, url) {
    return !(/.*palindrom(\/reconnect)?$/.test(url));
  });

  // default implementation fires onload event. see https://github.com/sinonjs/sinon/issues/432
  sinon.FakeXMLHttpRequest.prototype.abort = function(){};

  var sinonFakeServer = sinon.fakeServer.create();


  sinonFakeServer.respondWith(function(request) {
    if(request.requestHeaders['Accept'] == 'application/json') {
      window.lastRequestContent = request.requestBody;
      var fullCopy = JSON.parse(JSON.stringify(full));
      fullCopy['_ver#s'] = serverVersionNumber;
      fullCopy['_ver#c'] = clientVersionNumber;
      request.respond(200, [{name: "Location", value: this.url},{name: "X-Referer", value: lastUrl}], JSON.stringify(fullCopy));
    } else if(request.requestHeaders['Accept'] == 'application/json-patch+json') {
      var outPatches = [];
      handlePageLoad(this.url);
      outPatches.push({op: 'replace', path: '_ver#s', value: ++serverVersionNumber});
      outPatches.push({op: 'test', path: '_ver#c$', value: clientVersionNumber});
      outPatches.push({op: 'replace', path: '/user/firstName$', value: full.user.firstName$});
      outPatches.push({op: 'replace', path: '/user/lastName$', value: full.user.lastName$});
      outPatches.push({op: 'replace', path: '/user/fullName', value: full.user.fullName});
      request.respond(200, [], JSON.stringify(outPatches));
    } else {
      throw new Error("unexpected request - url matches palindrom (=" + request.url + "), yet Accept header is not json nor json patch (=" + request.requestHeaders['Accept'] + ")");
    }
  });
  sinonFakeServer.autoRespond = true;

  WebSocket.prototype.send = function (data) {
    console.info("Mock WebSocket .send ",data);
      var inPatches = data ? JSON.parse(data) : [];
      var outPatches = [];

      clientVersionNumber = inPatches.shift().value;
      var serverVersionForOT = inPatches.shift(); // disregard

      serverVersionNumber++;
      outPatches.push({op: 'replace', path: '_ver#s', value: serverVersionNumber});
      outPatches.push({op: 'test', path: '_ver#c$', value: clientVersionNumber});

      jsonpatch.applyPatch(full, inPatches);


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
    if(enableServerReplies) {
      setTimeout(function () {
        that.onmessage({data: JSON.stringify(outPatches) });
      }, 10);
    }
  };

  WebSocket.prototype.close = function(event) {
    if(this.onclose) {
      this.onclose(event);
    }
  }
})();