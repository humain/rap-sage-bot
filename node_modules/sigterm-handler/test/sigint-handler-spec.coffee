_              = require 'lodash'
SigtermHandler = require '../src/sigterm-handler.coffee'

describe 'SigintHandler', ->
  beforeEach ->
    @process =
      exit: sinon.spy()
      on:   sinon.spy()
    @logFn = sinon.spy()
    @sut = new SigtermHandler { @process, @logFn, timeout: 500, events: ['SIGINT']}

  describe 'when successfuly exits', ->
    describe 'when called with one registered handler', ->
      beforeEach (done) ->
        @handler = sinon.spy()
        @sut.register (callback) =>
          @handler()
          callback null
        @sut.exit('SIGINT')
        _.delay done, 50

      it 'should log the sigterm event', ->
        expect(@logFn).to.have.been.calledWith 'SIGINT caught, exiting'

      it 'should call the registered handler', ->
        expect(@handler).to.have.been.called

      it 'should call process.on SIGINT', ->
        expect(@process.on).to.have.been.calledWith 'SIGINT'

      it 'should call process.exit with 0', ->
        expect(@process.exit).to.have.been.calledWith 0

    describe 'when called with two registered handlers', ->
      beforeEach (done) ->
        @handlerOne = sinon.spy()
        @handlerTwo = sinon.spy()
        @sut.register (callback) =>
          @handlerOne()
          callback null
        @sut.register (callback) =>
          @handlerTwo()
          callback null
        @sut.exit('SIGINT')
        _.delay done, 50

      it 'should log the sigterm event', ->
        expect(@logFn).to.have.been.calledWith 'SIGINT caught, exiting'

      it 'should call the registered handlers', ->
        expect(@handlerOne).to.have.been.called
        expect(@handlerTwo).to.have.been.called

      it 'should call process.on SIGINT', ->
        expect(@process.on).to.have.been.calledWith 'SIGINT'

      it 'should call process.exit with 0', ->
        expect(@process.exit).to.have.been.calledWith 0

    describe 'when a registered handler times out', ->
      beforeEach (done) ->
        @handler = sinon.spy()
        @sut.register (callback) =>
          @handler()
        @sut.exit('SIGINT')
        _.delay done, 1000

      it 'should log the sigterm event', ->
        expect(@logFn).to.have.been.calledWith 'SIGINT caught, exiting'

      it 'should call the registered handler', ->
        expect(@handler).to.have.been.called

      it 'should call process.on SIGINT', ->
        expect(@process.on).to.have.been.calledWith 'SIGINT'

      it 'should call process.exit with 0', ->
        expect(@process.exit).to.have.been.calledWith 0

    describe 'when a registered handler is not a function', ->
      beforeEach (done) ->
        @sut.register 'hello'
        @sut.exit('SIGINT')
        _.delay done, 1000

      it 'should log the sigterm event', ->
        expect(@logFn).to.have.been.calledWith 'SIGINT caught, exiting'

      it 'should call process.on SIGINT', ->
        expect(@process.on).to.have.been.calledWith 'SIGINT'

      it 'should call process.exit with 0', ->
        expect(@process.exit).to.have.been.calledWith 0

  describe 'when it fails', ->
    describe 'when called with one registered handler', ->
      beforeEach (done) ->
        @handler = sinon.spy()
        @sut.register (callback) =>
          @handler()
          callback new Error 'oh no'
        @sut.exit('SIGINT')
        _.delay done, 50

      it 'should log the sigterm event', ->
        expect(@logFn).to.have.been.calledWith 'SIGINT caught, exiting'

      it 'should log the error', ->
        expect(@logFn).to.have.been.called

      it 'should call the registered handler', ->
        expect(@handler).to.have.been.called

      it 'should call process.on SIGINT', ->
        expect(@process.on).to.have.been.calledWith 'SIGINT'

      it 'should call process.exit with 1', ->
        expect(@process.exit).to.have.been.calledWith 1

    describe 'when called with two registered handlers', ->
      beforeEach (done) ->
        @handlerOne = sinon.spy()
        @handlerTwo = sinon.spy()
        @sut.register (callback) =>
          @handlerOne()
          callback new Error 'oh no'
        @sut.register (callback) =>
          @handlerTwo()
          callback null
        @sut.exit('SIGINT')
        _.delay done, 50

      it 'should log the error', ->
        expect(@logFn).to.have.been.called

      it 'should call the registered handlers', ->
        expect(@handlerOne).to.have.been.called
        expect(@handlerTwo).to.have.been.called

      it 'should call process.on SIGINT', ->
        expect(@process.on).to.have.been.calledWith 'SIGINT'

      it 'should call process.exit with 1', ->
        expect(@process.exit).to.have.been.calledWith 1

  describe 'when there are no registered handlers', ->
    beforeEach (done) ->
      @sut.exit('SIGINT')
      _.delay done, 50

    it 'should call process.on SIGINT', ->
      expect(@process.on).to.have.been.calledWith 'SIGINT'

    it 'should call process.exit with 0', ->
      expect(@process.exit).to.have.been.calledWith 0
