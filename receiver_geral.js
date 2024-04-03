var amqp = require('amqplib/callback_api');
const {MailSlurp} = require('mailslurp-client');
const mailslurp = new MailSlurp({
    apiKey: "84e63c7321eaebefb0a7d9f64b0a7f1bab4b5bee28bf0b5d1da1a5256b3a97a6"
});


amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    var exchange = 'geral';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, (msg) => {
      	if(msg.content) {
            setTimeout(() => {
              sendEmail();
	            console.log(" [x] %s", msg.content.toString());
              console.log(" [x] Done");
              //Caso algum erro aconteça e a mensagem não seja processada ela volta para a fila
              channel.ack(msg);
          }, 2000)
	      }
      }, {
        noAck: false
      });
    });
  });
});

/*async function sendEmail() {
  const { id, emailAddress } = await mailslurp.createInbox();
  const sent = await mailslurp.sendEmail(id, {
    to: [emailAddress],
    isHTML: true,
    subject: 'TESTE',
    charset: 'utf-8',
    body: '<html>NewsLetter Geral</html>',
  });

}*/