import _ from 'lodash'
import chalk from 'chalk'

export const bytesToSize = (bytes) => {
  const b = Number(bytes)
  if (b === 0) { return '0 Byte' }
  const k = 1000
  const dm = 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  const val = parseFloat((b / Math.pow(k, i)).toFixed(dm))
  return `${val} ${sizes[i]}`
}

export const displayError = err => {
  if (_.isString(err)) {
    return console.log(err)
  }
  console.log('Shit happened.')
}

export const log = str => {
  console.log(`${chalk.gray('>>')} ${str}`)
}
