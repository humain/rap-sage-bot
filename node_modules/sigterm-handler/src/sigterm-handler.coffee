_     = require 'lodash'
async = require 'async'

class SigtermHandler
  constructor: ({ @process, @logFn, @timeout, @events }={}) ->
    @process ?= process
    @logFn   ?= console.error
    @timeout ?= 20 * 1000
    @handleSigInt ?= false
    @handlers = []
    @events ?= ['SIGTERM']
    throw new Error 'Events can not be empty' if _.isEmpty(@events)
    throw new Error 'Events must be an array' unless _.isArray(@events)
    @_listen()

  _listen: =>
    _.each @events, (event) =>
      @process.on event, =>
        @exit event

  register: (fn) =>
    @handlers.push fn

  exit: (event) =>
    @logFn "#{event} caught, exiting"
    exitFn = async.timeout @_exit, @timeout
    exitFn @_die

  _exit: (done) =>
    async.each @handlers, @_handleHandler, done

  _die: (error) =>
    return @process.exit 0 if error?.code == 'ETIMEDOUT'
    @logFn error.stack if error?.stack?
    @logFn error if error? && !error?.stack?
    return @process.exit 1 if error?
    @process.exit 0

  _handleHandler: (fn, done) =>
    return done null unless _.isFunction fn
    fn done

module.exports = SigtermHandler
