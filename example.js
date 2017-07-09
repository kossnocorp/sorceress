const { context, when } = require('sorceress')
const assert = require('assert')

const test = context('Some module name', { a: 1, b: 2 })

// Simple test

test(() => {
  assert(true)
})

// Test with context

test(({ a, b }) => {
  assert(a === 1)
  assert(b === 2)
})

// Test with conditions

const withUser = when(context => ({ ...context, user: { name: 'Sasha' } }))
const withSomethingElse = when(context => ({ ...context, wut: 'Whatever' }))

test([withUser, withSomethingElse], ({ user: { name }, wut }) => {
  assert(name === 'Sasha')
  assert(wut === 'Whatever')
})

// Test with annotations

const withRememberMe = when('remember me is checked', context => ({
  ...context,
  rememberMe: true
}))

test('session is stored', [withRememberMe], ({ rememberMe }) => {
  assert(rememberMe)
})

// Scenario

import UserInfo from 'app/ui/_lib/UserInfo'
import { withUser } from 'test/_lib/factories'

const scenario = context('UserInfo')

scenario('renders user infromation', [withUser], ({ user }) => (
  <UserInfo user={user} />
))
