module.exports = session

function session () {
  const queue = []
  return {
    context: context.bind(null, queue),
    when: when.bind(null, queue),
    run: run.bind(null, queue)
  }
}

function context (queue, maybeContextDescription, maybeContextObj) {
  let contextDescription, contextObj
  if (
    typeof maybeContextDescription === 'string' &&
    (!maybeContextObj || typeof maybeContextObj === 'object')
  ) {
    contextDescription = maybeContextDescription
    contextObj = maybeContextObj
  } else if (typeof maybeContextDescription === 'object') {
    contextObj = maybeContextDescription
  }

  return (maybeDescription, maybeConditions, maybeFn) => {
    let description,
      conditions = [],
      fn

    if (
      typeof maybeDescription === 'function' &&
      !maybeConditions &&
      !maybeFn
    ) {
      fn = maybeDescription
    } else if (
      typeof maybeDescription === 'string' &&
      typeof maybeConditions === 'function' &&
      !maybeFn
    ) {
      description = maybeDescription
      fn = maybeConditions
    } else if (
      Array.isArray(maybeDescription) &&
      typeof maybeConditions === 'function' &&
      !maybeFn
    ) {
      conditions = maybeDescription
      fn = maybeConditions
    }

    queue.push({
      contextDescription,
      description,
      conditions,
      fn: fn.bind(null, contextObj)
    })
  }
}

function when (queue) {}

function run (queue) {
  const report = []

  queue.forEach(({ contextDescription, description, fn }) => {
    let error
    try {
      // TODO: Use conditions to alter contextObj
      fn()
    } catch (err) {
      error = err
    }

    report.push({
      contextDescription,
      description,
      error
    })
  })

  return report
}
