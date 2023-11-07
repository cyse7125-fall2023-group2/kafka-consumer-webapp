const avro = require('avsc');

module.exports = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'uri',
      type: 'string',
    },
    {
      name: 'is_paused',
      type: 'boolean',
    },
    {
      name: 'num_retries',
      type: 'int',
    },
    {
      name: 'response_time_sla',
      type: 'int',
    },
    {
      name: 'use_ssl',
      type: 'boolean',
    },
    {
      name: 'response_status_code',
      type: 'int',
    },
    {
      name: 'check_interval_in_seconds',
      type: 'int',
    },
    {
      name: 'check_created',
      type: 'int',
    },
    {
      name: 'check_updated',
      type: 'int',
    },
    {
      name: 'uptime_sla',
      type: 'int',
    }
  ]
});
