module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                src: ['build/']
            }
        },

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
            app: {
                options: {
                    browserifyOptions: {
                        debug: false
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
            app: {
                files: {
                    'www/app.js': 'www/app.js'
                }
            },
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
                    src: ['styles/**','resources/**'],
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
        },

        processhtml: {
            web: {
                files: {
                    'build/index.html': ['www/index.html']
                }
            }
        }

    });

    // Default task(s).
    grunt.registerTask('default', ['env:dev','browserify:dev']);
    grunt.registerTask('build:app', ['env:build','browserify:app','uglify:app']);
    grunt.registerTask('build:web', ['clean:build','env:build','browserify:prod','copy:build','uglify:prod','processhtml:web']);

};

