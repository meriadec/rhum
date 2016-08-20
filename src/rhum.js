#!/usr/bin/env node

import program from 'commander'

import { version } from '../package.json'
import select from './select'
import { displayError, log } from './helpers'

import * as t411 from './modules/t411'

const DEFAULT_TARGET = 't411'

const targets = {
  t411,
}

program
  .version(version)
  .usage('[options] <query>')
  .option('-t, --target [site]', 'Target site. Can be one of [t411, cpasbien] (default: t411)')
  .parse(process.argv)

const query = program.args.join(' ')

if (!query) {
  displayError('Please provide a query.')
  process.exit(1)
}

const targetName = targets[program.target || DEFAULT_TARGET]
  ? (program.target || DEFAULT_TARGET)
  : DEFAULT_TARGET

const target = targets[targetName]

log(`Connecting to ${targetName}...`)

target
  .search(query)
  .then(results => {
    if (!results.length) { throw 'No results.' }
    return results
  })
  .then(select)
  .then(target.download)
  .catch(displayError)
