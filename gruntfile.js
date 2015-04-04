module.exports = function (grunt) {
  grunt.initConfig({
    shell: {
      scripts: {
        command: 'duo app/build.js > build/build.js'
      }
    },

    less: {
      css: {
        files: {'build/build.css' : 'app/build.less'}
      }
    },

    copy: {
      index: {
        src: 'app/index.html',
        dest: 'build/index.html'
      },
      data: {
        expand: true,
        cwd: 'app/data/',
        src: ['**'],
        dest: 'build/data/',
      },
      assets: {
        expand: true,
        cwd: 'app/assets/',
        src: ['**'],
        dest: 'build/assets/',
      }
    },

    uglify: {
      options: {
        mangle: true,
        compress: true,
      },
      build: {
        src: 'build/build.js',
        dest: 'build/build.js'
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
      js: {
        files: ['app/modules/**/*.js', 'app/**/*.js'],
        tasks: ['scripts']
      },
      css: {
        files: ['app/**/*.less'],
        tasks: ['css']
      },
      data: {
        files: ['app/data/**/*', 'app/assets/**/*', 'app/index.html'],
        tasks: ['data']
      }
    },
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('scripts', ['shell']);
  grunt.registerTask('css', ['less']);
  grunt.registerTask('data', ['copy']);

  grunt.registerTask('default', ['scripts', 'css', 'data']);
  grunt.registerTask('gatherer', ['default', 'uglify']);
  grunt.registerTask('gatherer-dev', ['default', 'concurrent']);
};
