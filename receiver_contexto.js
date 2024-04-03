var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receiver_contexto.js [nome_newsletter]");
  process.exit(1);
}

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    var exchange = 'contexto';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
      }, function(error2, q) {
        if (error2) {
          throw error2;
        }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach((severity) => {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, (msg) => {
        console.log(`[x] ${msg.fields.routingKey}: ${msg.content.toString()}`)
      }, {
        noAck: true
      });
    });
  });
});