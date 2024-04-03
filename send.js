const amqp = require('amqplib/callback_api');


//criacao do channel
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    //nome da queue
    var queue = 'task_queue';
    //mensagem a ser transmitida
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(queue, {
      durable: true
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
    });
    console.log(" [x] Sent %s", msg);
  });
  //fecha a conexão e mata o processo
  setTimeout(function() {
    connection.close();
    process.exit(0)
    }, 500);
});



