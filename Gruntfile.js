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
                    'www/app.js': ['src/app.jsx']
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
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'www/',
                    src: ['index.html','styles/**','resources/**'],
                    dest: 'build/'
                }]
            }
        },
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            build: {
                NODE_ENV: 'production'
            }
        }

    });

    // Default task(s).
    grunt.registerTask('default', ['env:dev','browserify:dev']);
    grunt.registerTask('build:prod', ['env:build','browserify:prod','copy:build','uglify:prod']);

};

