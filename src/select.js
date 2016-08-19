import _ from 'lodash'
import blessed from 'blessed'

const createScreen = reject => {

  const screen = blessed.screen({
    smartCSR: true,
  })

  screen.title = 'Select a torrent'

  screen.key(['escape', 'q', 'C-c'], () => {
    screen.destroy()
    return reject('Nothing selected')
  })

  return screen

}

export default items => new Promise((resolve, reject) => {

  const screen = createScreen(reject)

  try {

    const box = blessed.box({
      parent: screen,
      left: 0,
      top: 0,
    })

    const tableItems = items.map(t => [
      _.padEnd(_.truncate(t.name.trim(), { length: 50 }), 50),
      _.padStart(t.size, 10),
      _.padStart(t.seeders, 10),
    ])

    const table = blessed.listtable({
      parent: box,
      keys: true,
      width: '100%',
      height: '100%',
      align: 'right',
      style: {
        header: {
          bold: true,
        },
        cell: {
          selected: {
            bg: 'white',
            fg: 'black',
          },
        },
      },
      data: [
        ['', '     Size', '     Seeders'],
        ...tableItems,
      ],
    })

    table.on('select', (item) => {
      screen.destroy()
      const selected = items[item.index - 3]
      resolve(selected)
    })

    table.focus()

    screen.render()

  } catch (err) {
    screen.destroy()
    console.log(err)
    reject(err)
  }
})
