// function createMockServer() {
  jasmine.Ajax.install();
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

  var stub = jasmine.Ajax.stubRequest(/(\/lab\/polymer\/?$|\/examples\/polymer\/?$|index\.html$|subpage\.html$)/);
  stub.andReturn({
    "responseText": "Error"
  });

  var _old = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (data) {
    if (data == null && this.requestHeaders['Accept'] == 'application/json') {
      stub.responseText = JSON.stringify(full);
      stub.responseHeaders = [{name: "Location", value: this.url},{name: "X-Referer", value: lastUrl}];
    }
    else if (this.requestHeaders['Accept'] == 'application/json-patch+json' &&
      this.url != lastUrl) {
      var outPatches = [];

        handlePageLoad(this.url);
        // stub.responseHeaders = [{name: "Location", value: this.url},{name: "X-Referer", value: lastUrl}];
        lastUrl = this.url;
        serverVersionNumber++;
        outPatches.push({op: 'replace', path: '/_ver#s', value: serverVersionNumber});
        outPatches.push({op: 'test', path: '/_ver#c$', value: full.user.firstName$});
        outPatches.push({op: 'replace', path: '/user/firstName$', value: full.user.firstName$});
        outPatches.push({op: 'replace', path: '/user/lastName$', value: full.user.lastName$});
        outPatches.push({op: 'replace', path: '/user/fullName', value: full.user.fullName});

      stub.responseText = JSON.stringify(outPatches);
    }
    else {
      stub.responseText = "Error";
    }
    console.info("Mock Server ",this.url, "\n request", data, "\n response", stub.status, stub.responseText);
    return _old.apply(this, [].slice.call(arguments));
  };

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
// };
