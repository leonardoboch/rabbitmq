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
    var exchange = 'direct_logs';
    //processa a string enviada via terminal
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || 'Hello World!';
    var severity = (args.length > 0) ? args[0] : 'info';

    // manda para a exchange direct
    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});