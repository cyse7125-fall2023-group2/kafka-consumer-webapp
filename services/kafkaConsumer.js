const Kafka = require('node-rdkafka');
const eventType = require('./eventType')
const dpService = require('./httpCheckService')


    const consumer = new Kafka.KafkaConsumer({
        "group.id":'kafka',
        "metadata.broker.list":"localhost:9092"
    })
    
    const init = async()=>{
        console.log("init function is working");
        consumer.connect();
        consumer.on('ready',()=>{
            console.log("consumer is working");
            consumer.subscribe(['test']);
            consumer.consume();
        }).on('data',async function(data){
            var consumerData = eventType.fromBuffer(data.value);
            const res = await dpService.saveConsumerCheck(consumerData);

        })        
    }



module.exports = {
    init
}


