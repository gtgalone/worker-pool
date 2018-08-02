const AWS = require('aws-sdk')
const chalk = require('chalk')
const ora = require('ora')
const { sleep } = require('./utils')

// To prevent duplicate process: invariant VISIBILITY_TIMEOUT > ESTIMATED_CALCULATION_TIME

const VISIBILITY_TIMEOUT = 10
const WAIT_TIME_SECONDS = 3
const ESTIMATED_CALCULATION_TIME = 5

const sqs = new AWS.SQS({
  region: 'ap-northeast-2',
})

async function receiveMessage() {
  const spinner = ora('Waiting for new message...').start()

  const result = await sqs.receiveMessage({
    QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/226055340302/architecting',
    VisibilityTimeout: VISIBILITY_TIMEOUT,
    WaitTimeSeconds: WAIT_TIME_SECONDS,
  }).promise()

  spinner.stop()

  return result
}

async function deleteMessage(handle) {
  // console.log('deleteMessage', handle)

  return await sqs.deleteMessage({
    QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/226055340302/architecting',
    ReceiptHandle: handle,
  }).promise()
}

async function run() {
  while (true) {
    const { Messages } = await receiveMessage()
    if (!Messages) continue

    for (const message of Messages) {
      const body = JSON.parse(message.Body)

      // Do something
      console.log(`message[${chalk[body.color](message.MessageId)}]: Start calculation`)
      const spinner = ora(`Calculating...`).start()
      await sleep(ESTIMATED_CALCULATION_TIME * 1000)
      spinner.succeed('done')

      // TODO: await saveResultToDatabase()

      await deleteMessage(message.ReceiptHandle)
    }
  }
}

run()
