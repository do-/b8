module.exports = function (grunt) {

  require('jit-grunt')(grunt);
  
  var appModules = grunt.file.expand ({filter: "isFile", cwd: "root/_/app/js"}, ["*/*.js"]).map (function (s) {return 'app/' + s.replace ('.js', '')})
  appModules.unshift ('../app/handler')
  appModules.unshift ('jquery/jquery-3.1.1.min.js')

  grunt.initConfig ({
  
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "root/_/libs/tmilk/tmilk.css": "root/_/libs/tmilk/tmilk.less"
        }
      }
    },
    
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: false,
        createTag: false,
        push: false
      }
    },
    
    replace: {
      versionNumber: {
        src: ['root/index.html'],
        overwrite: true,
        replacements: [{
          from: /var ver.*/,
          to: "var ver = '<%= grunt.file.readJSON ('package.json') ['version'] %>';"
        }]
      }
    },
    
    requirejs: {
      compile: {
        options: {
            baseUrl: 'root/_/libs',
            paths: {
                app: '../app/js'
            },
//            optimize: "none",
            out: "root/_/app/js/_.js",
            findNestedDependencies: true,
            include: appModules
        }
      }
    },    

    watch: {

      general: {
        files: ['root/**/*.*'],
        tasks: ['bump', 'replace'],
        options: {nospawn: true}
      },

      styles: {
        files: ['root/_/libs/tmilk/*.less'],
        tasks: ['less'],
        options: {nospawn: true}
      },

      js: {
        files: ['root/_/*/**/*.js'],
        tasks: ['requirejs'],
        options: {nospawn: true}
      }

    }
    
  });
  
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  
  grunt.registerTask('default', ['watch']);
  
};