const avro = require('avsc');

module.exports = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'status',
      type: 'string'
    },
    {
      name: 'message',
      type: 'string',
    }
  ]
});
