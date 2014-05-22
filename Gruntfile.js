/*-----------------------------------------------------
 * livereload Default Setting
 *-----------------------------------------------------*/
'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

/*-----------------------------------------------------
 * Module Setting
 *-----------------------------------------------------*/
module.exports = function (grunt) {

    var banner = '/*!\n' +
        ' * ====================================================\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * GitHub: <%= pkg.repository.url %> \n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        ' * ====================================================\n' +
        ' */\n\n',
        buildPath = 'index.html',
        srcDir = '_src/',
        distDir = 'dist/',
        serverPort = 9001,
        livereloadPort = 35729;

    var getPath = function ( readFile, srcDir) {
            var sources = require("fs").readFileSync(readFile);
            sources = /filelist = \[([^)]+)\]/.exec( sources );
            sources = sources[1].replace( /\/\/.*\n/g, '\n' ).replace( /'|"|\n|\t|\s/g, '' );
            sources = sources.split( "," );
            sources.forEach( function ( filepath, index ) {
                sources[ index ] = srcDir + filepath;
            });
            return sources;
        };

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        concat: {

            js: {
                options: {
                    banner: banner + '(function($, window) {\n\n',
                    footer: '\n\n})(jQuery, window);\n',
                    process: function(src, filepath) {
                        return src + "\n";
                    }
                },
                src: getPath( buildPath, srcDir ),
                dest: distDir + 'ufinder.js'
            }

        },

        uglify: {
            minimize: {
                files: (function (){
                    var o = {};
                    o[distDir + 'ufinder.min.js'] = distDir + 'ufinder.js';
                    return o;
                })()
            }
        },

        copy: {
            base: {
                files: [
                    {
                        src: ['dialogs/**', 'lang/**', 'lib/**', 'server/**', 'themes/**'],
                        dest: distDir
                    }
                ]
            }
        },

        /* Start [Task liverload] ------------------------------------*/
        livereload: {
            port: livereloadPort // Default livereload listening port.
        },
        connect: {
            livereload: {
                options: {
                    hostname: '*',
                    port: serverPort,
                    base: '.',
                    middleware: function(connect, options, middlewares) {
                        return [
                            lrSnippet,
                            connect.static(options.base.toString()),
                            connect.directory(options.base.toString())
                        ]
                    }
                }
            }
        },
        regarde: {
            js:{
                files: srcDir + '**/*.js',
                tasks: ['default', 'livereload']
            }
        }
        /* End [Task liverload] ------------------------------------*/

    });

    // These plugins provide necessary tasks.
    /* [Build plugin & task ] ------------------------------------*/
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Build task(s).
    grunt.registerTask( 'default', [ 'concat:js', 'uglify:minimize', 'copy' ] );

    /* [liverload plugin & task ] ------------------------------------*/
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.registerTask('live', ['livereload-start', 'connect', 'regarde']);

};
