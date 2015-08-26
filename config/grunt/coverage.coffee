async = require('async')
fs = require('fs')
glob = require('glob')
istanbul = require('istanbul')
collector = new istanbul.Collector()
reporter = new istanbul.Reporter(null, '.build/coverage/merged')

module.exports = (grunt) ->
  grunt.config('replace',
    'istanbul':
      overwrite: true
      src: ['lib/**/*.js']
      replacements: [{
        from: /\n  extend = function\(child, parent\) \{ for \(var key in parent\) \{ /
        to: (match, index, full) ->
          return match + '/* istanbul ignore next */ '
      }]
  )

  grunt.registerTask('istanbul:instrument', ->
    grunt.util.spawn(
      cmd: './node_modules/.bin/istanbul'
      args: ['instrument', 'lib/', '-o', 'src/']
      opts:
        stdio: 'inherit'
    , this.async())
  )

  grunt.registerTask('istanbul:report', ->
    done = this.async()
    glob('.build/coverage/**/*.json', (er, files) ->
      async.each(files, (file, callback) ->
        fs.readFile(file, 'utf8', (err, data) ->
          collector.add(JSON.parse(data))
          callback()
        )
      , (err) ->
        reporter.addAll(['html', 'text'])
        reporter.write(collector, false, done)
      )
    )
  )
