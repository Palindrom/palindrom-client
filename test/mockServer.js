(function() {
  var serverVersionNumber = 0,
      clientVersionNumber = 0,
      enableServerReplies = true;

  WebSocket = function FakeWebSocket() {
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

  function generateResponse(json, headersObj, type = 'application/json', status = 200) {
    const bodyString = JSON.stringify(json);
    const headers = new Headers(headersObj);
    const bodyBlob = new Blob([bodyString], { type })
    const res = new Response(bodyBlob, { status, headers });
    return res;
  }

  var lastUrl = window.location.href;
  handlePageLoad(lastUrl);

  window.fetch = function(url, options) {
      // serve reconnection requests as normal requests (do not change the location header)
      url = url.replace('/reconnect', '');
      if(options.headers['Accept'] == 'application/json') {
        window.lastRequestContent = options.body;
        var fullCopy = JSON.parse(JSON.stringify(full));
        fullCopy['_ver#s'] = serverVersionNumber;
        fullCopy['_ver#c'] = clientVersionNumber;
        return generateResponse(fullCopy, {"Location": url, "X-Referer": lastUrl}, 'application/json');
      } else if(options.headers['Accept'] == 'application/json-patch+json') {
        var outPatches = [];
        handlePageLoad(url);
        outPatches.push({op: 'replace', path: '_ver#s', value: ++serverVersionNumber});
        outPatches.push({op: 'test', path: '_ver#c$', value: clientVersionNumber});
        outPatches.push({op: 'replace', path: '/user/firstName$', value: full.user.firstName$});
        outPatches.push({op: 'replace', path: '/user/lastName$', value: full.user.lastName$});
        outPatches.push({op: 'replace', path: '/user/fullName', value: full.user.fullName});
        return generateResponse(fullCopy, {}, 'application/json-patch+json');
      } else {
        throw new Error("unexpected request - url matches palindrom (=" + url + "), yet Accept header is not json nor json patch (=" + options.headers['Accept'] + ")");
      }
  }  

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