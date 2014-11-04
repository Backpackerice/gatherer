module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      html: {
        src: ['app/templates/*.html'],
        dest: 'build/templates.html'
      },
      js: {
        src: ['app/js/**/*.js'],
        dest: 'build/scripts.js'
      }
    },

    replace: {
      templates: {
        src: ['app/index.html'],
        dest: 'build/',
        replacements: [{
          from: '<!-- TEMPLATES -->',
          to: function () {
            var templates = '';
            try { templates = grunt.file.read('./build/templates.html'); }
            catch (e) { console.log(e); }
            return templates;
          }
        }]
      }
    },

    less: {
      css: {
        files: {'build/styles.css' : 'app/css/source.less'}
      }
    },

    copy: {
      data: {
        src: 'data/*',
        dest: 'build/'
      },
      assets: {
        expand: true,
        cwd: 'app/assets/',
        src: ['**'],
        dest: 'build/assets/',
      }
    },

    clean: ['build/templates.html'],

    uglify: {
      options: {
        mangle: true,
        compress: true,
      },
      build: {
        src: 'build/scripts.js',
        dest: 'build/scripts.js'
      }
    },

    nodemon: {
      server: { script: 'server.js' }
    },

    concurrent: {
      tasks: ['nodemon:server', 'watch'],
      options: {logConcurrentOutput: true}
    },

    watch: {
      html: {
        files: ['app/templates/*.html'],
        tasks: ['concat:html', 'replace']
      },
      js: {
        files: ['app/js/**/*.js'],
        tasks: ['concat:js']
      },
      css: {
        files: ['app/css/*.less'],
        tasks: ['less']
      },
      data: {
        files: ['data/**/*'],
        tasks: ['copy:data']
      },
      assets: {
        files: ['assets/**/*'],
        tasks: ['copy:assets']
      }
    },
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'replace', 'less', 'copy:data', 'copy:assets', 'clean']);
  grunt.registerTask('dist', ['default', 'uglify']);
  grunt.registerTask('dev', ['default', 'concurrent']);
};
