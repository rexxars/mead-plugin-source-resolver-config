const Boom = require('boom')

const helpUrl = 'https://github.com/rexxars/mead#configuration'
const configSourceResolver = {
  name: 'config',
  type: 'source-resolver',
  register: ({app}, next) => {
    const sources = app.locals.config.sources || []
    if (sources.length === 0) {
      return next(new Error(
        `No sources configured. See ${helpUrl} for setup instructions.\n`
      ))
    }

    try {
      app.locals.configSourceResolver = {
        sources: sources.reduce(keyByName, {})
      }
    } catch (err) {
      return next(err)
    }

    return next()
  },
  handler: (sourceName, req, res, next) => {
    const source = req.app.locals.configSourceResolver.sources[sourceName]
    if (!source) {
      next(Boom.notFound(`Source with name "${sourceName}" not found`))
      return
    }

    res.locals.source = source
    next()
  }
}

module.exports = configSourceResolver

function keyByName(sources, source, i) {
  validateSource(source, i)

  const name = source.name
  if (sources[name]) {
    throw new Error(`More than one source with name "${name}" defined`)
  }

  sources[name] = source
  return sources
}

// @todo Pull out all validators into a validators package or exposed from main
function validateSource(src, index) {
  if (!src.name) {
    throw new Error(`Source at index ${index} did not contain required 'name'-property`)
  }

  if (!/^[-a-z0-9]+$/i.test(src.name)) {
    throw new Error(`Source names can only contain letters, numbers and dashes. "${src.name}" is not valid.`)
  }

  if (!src.adapter) {
    throw new Error(`Source with name "${src.name}" did not contain required 'adapter'-property`)
  }

  if (!src.adapter.type) {
    throw new Error(`Source with name "${src.name}" did not have a valid "adapter.type" property`)
  }
}
