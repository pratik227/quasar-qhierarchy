const { resolve } = require('node:path')
const { exec } = require('node:child_process')

const file = resolve(__dirname, '../umd-test.html')
const command = process.platform === 'darwin'
  ? 'open'
  : (process.platform === 'win32' ? 'start ""' : 'xdg-open')

exec(`${command} "${file}"`, err => {
  if (err) console.log(`Open ${file} in your browser.`)
})
