/* eslint-disable id-length, no-sync */
const test = require('tape')
const plugin = require('..')

const srcResolver = plugin.handler

test('has plugin props', t => {
  ['name', 'type', 'handler'].forEach(prop => {
    t.ok(plugin[prop])
  })
  t.end()
})

test('throws on empty sources array', t => {
  const app = {locals: {config: {sources: []}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('No sources'), 'has meaningful error')
    t.end()
  })
})

test('throws on missing sources array', t => {
  const app = {locals: {config: {}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('No sources'), 'has meaningful error')
    t.end()
  })
})

test('throws on missing adapter prop', t => {
  const app = {locals: {config: {sources: [{type: 'fs', name: 'fs'}]}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('adapter\'-property'), 'has meaningful error')
    t.end()
  })
})

test('throws on missing name prop', t => {
  const app = {locals: {config: {sources: [{adapter: {type: 'fs'}}]}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('name\'-property'), 'has meaningful error')
    t.end()
  })
})

test('throws on invalid name prop', t => {
  const app = {locals: {config: {sources: [{adapter: {type: 'fs'}, name: '1337-ghosts!'}]}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('letters, numbers and dashes'), 'has meaningful error')
    t.end()
  })
})

test('throws on missing adapter type prop', t => {
  const app = {locals: {config: {sources: [{adapter: {name: 'fs'}, name: 'cool'}]}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('type'), 'has meaningful error')
    t.end()
  })
})

test('throws on duplicate source names', t => {
  const sources = [{adapter: {type: 'fs'}, name: 'fs'}, {adapter: {type: 'fs'}, name: 'fs'}]
  const app = {locals: {config: {sources}}}
  plugin.register({app}, err => {
    t.ok(err instanceof Error, 'should error')
    t.ok(err.message.includes('More than one source'), 'has meaningful error')
    t.end()
  })
})

test('throws if source name cannot be resolved', t => {
  const app = {locals: {config: {sources: [{adapter: {type: 'fs'}, name: 'fs'}]}}}
  const res = {locals: {}}

  plugin.register({app}, err => {
    t.ifError(err, 'should not error')

    srcResolver('gcs', {app}, res, resolveErr => {
      t.ok(resolveErr instanceof Error, 'should error')
      t.ok(resolveErr.message.includes('not found'), 'meaningful error')
      t.equal(resolveErr.output.statusCode, 404)
      t.end()
    })
  })
})

test('registered sources can be resolved', t => {
  const sources = [
    {adapter: {type: 'fs'}, name: 'fs'},
    {adapter: {type: 'gcs'}, name: 'gcs', config: {foo: 'bar'}}
  ]
  const app = {locals: {config: {sources}}}
  const res = {locals: {}}

  plugin.register({app}, err => {
    t.ifError(err, 'should not error')

    srcResolver('gcs', {app}, res, resolveErr => {
      t.ifError(resolveErr, 'should not error')
      t.equal(res.locals.source.config.foo, 'bar')
      t.end()
    })
  })
})
