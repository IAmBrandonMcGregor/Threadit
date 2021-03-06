
(function AttachThreadit (root, factory) {

	// Setup Threadit appropriately for the environment.

	// Start with AMD...
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	}
	// ...next try CommonJS...
	else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	}
	// ...and finally, as a browser global.
	else {
		root.Threadit = factory();
	}
}(this, function ThreaditFactory() {

	function Threadit (threadFunction, parameterObj) {

    // Create an external web-worker from the provided function.
    var jsURL = CreateExternalJavascriptBlob(threadFunction);
    var worker = new Worker(jsURL);

    // Create a function (this thread) that runs the new external-worker.
    var threadedFunction = function () {

      // Cache a copy of the parameters we'll later pass to the external-worker.
      var argsToSendToThread = Array.prototype.slice.apply(arguments, [0]);

      // Return a promise so we can free up the main thread.
      return new Promise(function (resolve, reject) {

        // Resolve the promise when the worker/thread is finished.
        worker.addEventListener('message', function ResolvePromise (message) {
          if (message.data.rejectThisPromise) {
            reject(message.data.data);
          }
          else {
            resolve(message.data);
          }
          worker.removeEventListener('message', ResolvePromise);
        });

        // Call the external-worker using the parameters.
        worker.postMessage({args:argsToSendToThread});
      });
    };

    // Provide a function that destroys the worker.
    threadedFunction.destroy = function () {
      window.URL.revokeObjectURL(jsURL);
      worker.removeEventListener('message');
      worker.terminate();
    };


    // Detect if the 'new' keyword was used.
    if (this.constructor == Threadit) {
      window.console.log('Threadit: called with new.');

      // Return a function that can be called multiple times.
      return threadedFunction;
    }
    else {
      window.console.log('Threadit: called as function.');

      // Auto-destroy the web worker once it's finished running this once.
      worker.addEventListener('message', threadedFunction.destroy);

      // Copy the arguments this function was called with.
      var threaditCallArgs = Array.prototype.slice.apply(arguments, [1]);

      return threadedFunction.apply(this, threaditCallArgs);
    }

	};

	// Private Functions
	// -----------------
  function CreateExternalJavascriptBlob (funk) {
    var inlineWorkerScript = new Blob(
      [WorkerizeStringitize(funk)],
      {type:'application/javascript'});

    return window.URL.createObjectURL(inlineWorkerScript);
  }
  // -----------------
	function WorkerizeStringitize (functionToStringitize) {
		var stringitizedFunk =
      'var threadedFunction = ' + functionToStringitize + '; \n\n'+
			'onmessage = function (message) { \n'+
      '  var result = threadedFunction.apply(null, message.data.args) \n'+
      '  if (result.then) \n'+
      '    result.then(postMessage, function (error) { \n'+
      '      postMessage({rejectThisPromise: true, data: error}) \n'+
      '    }); \n'+
      '  else \n'+
      '    postMessage(result); \n'+
			'}; \n';
		return stringitizedFunk;
	}

	return Threadit;

}));





















