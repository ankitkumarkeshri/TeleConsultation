const amqp = require("amqplib");

const startWorker = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("prescription_queue");

    console.log("Prescription Worker Running...");

    channel.consume("prescription_queue", (msg) => {
      const data = JSON.parse(msg.content.toString());

      console.log("Processing Prescription:", data);


      channel.ack(msg);
    });
  } catch (err) {
    console.error("Worker Error:", err.message);
  }
};

startWorker();