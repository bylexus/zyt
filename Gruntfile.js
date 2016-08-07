module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            options: {
                transform: [
                    ["babelify", {
                        presets: ["react", "es2015"]
                    }]
                ]
            },
            dev: {
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    'app-debug.js': ['src/app.jsx']
                }
            },
            prod: {
                options: {
                    browserifyOptions: {
                        debug: false
                    }
                },
                files: {
                    'build/app.js': ['src/app.jsx']
                }
            }
        },

        uglify: {
            prod: {
                files: {
                    'build/app.js': 'build/app.js'
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['browserify:dev']);
    grunt.registerTask('build:prod', ['browserify:prod','uglify:prod']);

};

