using Confluent.Kafka;
using System.Text.Json;

public class KafkaProducer
{
    private readonly IProducer<Null, string> _producer;

    public KafkaProducer()
    {
        var config = new ProducerConfig
        {
            BootstrapServers = "localhost:9092" // или твой адрес Kafka
        };

        _producer = new ProducerBuilder<Null, string>(config).Build();
    }

    public async Task SendNotificationAsync(object notification)
    {
        var json = JsonSerializer.Serialize(notification);

        await _producer.ProduceAsync("notifications", new Message<Null, string>
        {
            Value = json
        });

        Console.WriteLine("📤 Отправлено в Kafka: " + json);
    }
}
