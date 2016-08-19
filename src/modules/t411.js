import _ from 'lodash'
import fs from 'fs'
import t411 from 't411'

import { bytesToSize } from '../helpers'

const AUTH = {
  USERNAME: process.env.T411_USERNAME,
  PASSWORD: process.env.T411_PASSWORD,
}

let connector = null

const opts = {
  limit: Number.MAX_VALUE,
}

const createConnector = () => new Promise((resolve, reject) => {
  console.log('Creating connector...')
  const client = new t411()
  client.auth(AUTH.USERNAME, AUTH.PASSWORD, err => {
    if (err) { return reject(err) }
    connector = client
    console.log('Connection established.')
    resolve(client)
  })
})

const getConnector = () => {
  if (connector) { return Promise.resolve(connector) }
  return createConnector()
}

const searchTerm = (client, term) => new Promise((resolve, reject) => {
  console.log(`Searching "${term}"`)
  client.search(term, opts, (err, res) => {
    if (err) { return reject(err) }
    resolve(res)
  })
})

const downloadId = (client, id) => new Promise((resolve, reject) => {
  client.download(id, (err, buf) => {
    if (err) { return reject(err) }
    resolve(buf)
  })
})

const writeFile = (item, buf) => new Promise((resolve, reject) => {
  const fileName = `${item.name}.torrent`.trim()
  fs.writeFile(fileName, buf, (err) => {
    if (err) { return reject(err) }
    resolve(fileName)
  })
})

const transformTorrent = t => ({
  provider: 't411',
  id: t.id,
  name: t.name,
  seeders: t.seeders,
  size: bytesToSize(t.size),
})

const transformRes = res => {
  let torrents = _.sortBy(res.torrents, t => -Number(t.seeders))
  torrents = _.map(torrents, transformTorrent)
  return torrents
}

export const search = term => getConnector()
  .then(client => searchTerm(client, term))
  .then(transformRes)

export const download = item => getConnector()
  .then(client => downloadId(client, item.id))
  .then(buf => writeFile(item, buf))
  .then(fileName => {
    console.log(`${fileName} has been downloaded!`)
  })
