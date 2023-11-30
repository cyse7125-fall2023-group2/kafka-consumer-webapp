const { Kafka } = require('kafkajs')
const fs = require("fs");
const path = require("path");
require('dotenv').config()
const eventType = require('./eventType')
const dpService = require('./httpCheckService')


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.BROKER_ENDPOINT],
  // sasl: {
  //   mechanism: 'plain', // scram-sha-256 or scram-sha-512
  //   username: process.env.SASL_USERNAME,
  //   password: process.env.SASL_PASSWORD
  // }
})


const consumer = kafka.consumer({ groupId: 'test-group' })

const init = async () =>{
    await consumer.connect()
    await consumer.subscribe({ topic: 'test', fromBeginning: true })
    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

        console.log({
            value: message.value.toString()
        });
        let consumerData = JSON.parse(message.value.toString());
        console.log(consumerData.status);
        // console.log({
        // value: message.value.toString(),
        // })
        //  console.log(eventType.fromBuffer(message.value));
        //   var consumerData = eventType.fromBuffer(message.value);
        //  console.log(consumerData);
         const res = await dpService.saveConsumerCheck(consumerData);
    },
    })
}
module.exports = {
    init
}