const amqp = require('amqplib/callback_api');

//conexao e criacao do channel
amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    //declaracao da exchange
    var exchange = 'contexto';
    //processa a string enviada via terminal
    var args = process.argv.slice(2);
    var msg = 'Envia'
    var severity = (args.length > 0) ? args[0] : 'broadcast';
    channel.assertExchange(exchange, 'direct', {
        durable: false
      });

    // manda para a exchange direct
    if(severity == 'broadcast') {
        channel.publish(exchange, 'cinema', Buffer.from(msg));
        channel.publish(exchange, 'esporte', Buffer.from(msg));
        console.log(`[x] Sent ${severity}: ${msg}`);

    } else {
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(`[x] Sent ${severity}: ${msg}`);
    }
    
  });

  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
});