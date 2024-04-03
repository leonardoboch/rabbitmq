const amqp = require('amqplib/callback_api');

//conexao e criacao do channel
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    //declaracao da exchange
    var exchange = 'geral';
    //processa a string enviada via terminal
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || 'Hello World!';

    // manda para a exchange geral/fanout
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
    channel.publish(exchange, '', Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'",msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});