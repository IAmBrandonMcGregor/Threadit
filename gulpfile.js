
// Require the external libs and modules.
var gulp = require('gulp'),
	browserSync = require('browser-sync');


// Gulp Task -- default
// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  --
// Starts the tooling.
// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  --
gulp.task('default', ['browser-sync'], function () {
});


// Gulp Task -- browser-sync
// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  --
// Enables live-reload and syncronized browser scrolling. - http://www.browsersync.io
// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  --
gulp.task('browser-sync', function startBrowserSync () {
	browserSync({
		ui: false,
		files: ['index.html', 'threadit.js'],
		online: false,
		browser: ['google chrome'],
		reloadOnRestart: true,
		scrollThrottle: 100,
		server: {
			baseDir: './'
		}
	});
});