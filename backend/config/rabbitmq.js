const amqp = require("amqplib");

let channel;

const connectRabbit = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertQueue("prescription_queue");

    console.log("RabbitMQ Connected");
  } catch (err) {
    console.error("RabbitMQ Error:", err.message);
  }
};

const sendToQueue = (data) => {
  if (!channel) {
    console.log("RabbitMQ not ready");
    return;
  }

  channel.sendToQueue(
    "prescription_queue",
    Buffer.from(JSON.stringify(data))
  );
};

module.exports = { connectRabbit, sendToQueue };