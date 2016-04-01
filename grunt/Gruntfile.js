module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // compass tasks
        compass: {
            dev: {
                reference: {
                    'themes/armyfit/css': 'themes/armyfit/sass',
                    'themes/standard/css': 'themes/standard/sass',
                    'themes/tma/css': 'themes/tma/sass'
                },
                options: {
                    config: 'config.rb',
                    environment: 'development',
                    imagesDir: '',
                    fontsDir: '',
                    relativeAssets: true,
                    force: true
                }
            },
            dist: {
                reference: '<config:compass.dev.reference>',
                options: {
                    config: 'prod-config.rb',
                    environment: 'production',
                    relativeAssets: false,
                    force: true
                }
            },
            // used to generate theme specific development css with relative paths to images and fonts
            armyfitDev: {
                reference: {
                    'themes/armyfit/css': 'themes/armyfit/sass'
                },
                options: {
                    sassDir: './themes/armyfit/sass',
                    cssDir: './themes/armyfit/css',
                    config: './themes/armyfit/config.rb',
                    imagesDir: './themes/armyfit/images',
                    fontsDir: './themes/armyfit/fonts',
                    relativeAssets: true,
                    force: true
                }
            },
            standardDev: {
                reference: {
                    'themes/standard/css': 'themes/standard/sass'
                },
                options: {
                    sassDir: './themes/standard/sass',
                    cssDir: './themes/standard/css',
                    config: './themes/standard/config.rb',
                    imagesDir: './themes/standard/images',
                    fontsDir: './themes/standard/fonts',
                    relativeAssets: true,
                    force: true
                }
            },
            tmaDev: {
                reference: {
                    'themes/tma/css': 'themes/tma/sass'
                },
                options: {
                    sassDir: './themes/tma/sass',
                    cssDir: './themes/tma/css',
                    config: './themes/tma/config.rb',
                    imagesDir: './themes/tma/images',
                    fontsDir: './themes/tma/fonts',
                    relativeAssets: true,
                    force: true
                }
            },
            force: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        },
        // css minification
        cssmin: {
            css:{
                files: {
                    './themes/armyfit/master.min.css': ['./themes/armyfit/css/**/*.css'],
                    './themes/standard/master.min.css':['./themes/standard/css/**/*.css'],
                    './themes/tma/master.min.css':['./themes/tma/css/**/*.css']
                }
            }
        },
        // grunt watchers
        watch: {
            sass: {
                expand: true,
                files: ['**/*.scss'],
                tasks: ['compass:dev', 'cssmin']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-compass-multidir');

    // grunt tasks
    grunt.registerTask('default', ['compass:dev', 'cssmin']);
};