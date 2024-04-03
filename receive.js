
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'task_queue';

        channel.assertQueue(queue, {

            durable: true
        });
        //processa UMA mensagem por vez para cada worker, caso um esteja ocupado o outro vai receber
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(() => {
                console.log(" [x] Done");
                //Caso algum erro aconteça e a mensagem não seja processada ela volta para a fila
                channel.ack(msg);
            }, Number.parseInt(secs) * 1000)
        }, {
            //define se vamos usar acks para o rabbitMQ saber se processamos, ou não, a mensagem
            noAck: false
        });
    });
});