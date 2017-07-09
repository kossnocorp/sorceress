const session = require('.')
const assert = require('assert')

{
  const s = session()
  assert(typeof s.context === 'function', 'session() returns context function')
  assert(typeof s.when === 'function', 'session() returns when function')
  assert(typeof s.run === 'function', 'session() returns run function')
}

{
  const { context } = session()
  assert(typeof context() === 'function', 'context() returns test function')
}

{
  const { context, run } = session()
  const test = context()
  test(() => {
    throw new Error('Testing throw')
  })
  const report = run()
  assert(report.length === 1)
  assert(report[0].error)
  assert(report[0].error.message === 'Testing throw')
}

{
  const { context, run } = session()
  const test = context()
  test(() => assert(true))
  const report = run()
  assert(report.length === 1)
  report.forEach(({ error }) => assert(!error))
}

{
  const { context, run } = session()
  const test = context({ a: 1, b: 2 })
  test(({ a, b }) => {
    assert(a === 1)
    assert(b === 2)
  })
  const report = run()
  assert(report.length === 1)
  report.forEach(({ error }) => assert(!error))
}

{
  const { context, run } = session()
  const t1 = context('Test context 1')
  t1('Test test 1', () => {})
  t1('Test test 2', () => {})
  const t2 = context('Test context 2')
  t2('Another test', () => {})
  const report = run()
  assert(report.length === 3)
  assert.deepEqual(
    report,
    [
      {
        contextDescription: 'Test context 1',
        description: 'Test test 1',
        conditions: [],
        error: undefined
      },
      {
        contextDescription: 'Test context 1',
        description: 'Test test 2',
        conditions: [],
        error: undefined
      },
      {
        contextDescription: 'Test context 2',
        description: 'Another test',
        conditions: [],
        error: undefined
      }
    ],
    'run() must return report object'
  )
}

{
  const { context, when, run } = session()
  const test = context({a: 1, b: 2})
  const setAto3 = when((context) => Object.assign({}, context, {a: 3}))
  const setC = when((context) => Object.assign({}, context, {c: 0}))
  const setABCto0 = when((context) => Object.assign({}, context, {a: 0, b: 0, c: 0}))

  test([], (contextObj) => {
    assert.deepEqual({a: 1, b: 2})
  })

  test([setAto3], ({a}) => {
    assert(a === 3)
  })

  test([setAto3, setC], ({a, c}) => {
    assert(a === 3)
    assert(c === 0)
  })

  test([setAto3, setC, setABCto0], ({a, b, c}) => {
    assert(a === 0)
    assert(b === 0)
    assert(c === 0)
  })

  const report = run()
  assert(report.length === 4)
  report.forEach(({ error }) => assert(!error))
}
