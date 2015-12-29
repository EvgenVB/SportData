
module.exports = grunt => {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        bower_concat: {
            main: {
                dest: 'public/js/third-party.js',
                cssDest: 'public/css/third-party.css',
                mainFiles: {
                    bootstrap: ['dist/css/bootstrap.css']
                },
                dependencies: {
                    'underscore': ['jquery','moment'],
                    'backbone': 'underscore',
                    'dropzone': 'bootstrap',
                    'bootpag': 'bootstrap'
                }

            }
        },
        uglify: {
            bower: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'public/js/third-party.min.js': 'public/js/third-party.js'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'public/css/third-party.min.css': ['public/css/third-party.css']
                }
            }
        },
        copy: {
            bs_fonts: {
                files: [{expand: true, cwd: 'bower_components/bootstrap/dist/fonts/', src: ['*'], dest: 'public/fonts/', filter: 'isFile'}]
            }
        }
    });

    grunt.registerTask('build', [
        'bower_concat',
        'uglify:bower',
        'cssmin',
        'copy:bs_fonts'
    ]);
};