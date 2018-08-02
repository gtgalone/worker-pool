const AWS = require('aws-sdk')
const chalk = require('chalk')
const { sleep } = require('./utils')

const sqs = new AWS.SQS({
  region: 'ap-northeast-2',
})

const AVAILABLE_COLORS = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
]

let colorIndex = -1

function pickColor() {
  colorIndex = colorIndex + 1

  if (colorIndex >= AVAILABLE_COLORS.length) {
    colorIndex = 0
  }

  return AVAILABLE_COLORS[colorIndex]
}

async function run() {
  while (true) {
    const color = pickColor()

    const result = await sqs.sendMessage({
      MessageBody: JSON.stringify({ color, body: 'Hi there: ' + Date.now() }),
      QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/226055340302/architecting',
    }).promise()

    console.log(`Message ${chalk[color](result.MessageId)} published`)
    await sleep(5 * 1000 * Math.random())
  }
}

run()
