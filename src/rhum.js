#!/usr/bin/env node

import * as t411 from './modules/t411'
import select from './select'
import { displayError } from './helpers'

const query = process.argv.slice(2).join(' ')

if (!query) {
  console.log('Please provide a query.')
  process.exit(1)
}

t411.search(query)
  .then(select)
  .then(t411.download)
  .catch(displayError)
