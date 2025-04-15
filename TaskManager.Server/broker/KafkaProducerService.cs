using Confluent.Kafka;
using Microsoft.Extensions.Configuration;

public class KafkaProducerService
{
    private readonly IProducer<Null, string> _producer;
    private readonly string _topic;

    public KafkaProducerService(IConfiguration configuration)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = configuration["Kafka:BootstrapServers"] ?? "localhost:9092"
        };

        _producer = new ProducerBuilder<Null, string>(config).Build();
        _topic = configuration["Kafka:Topic"] ?? "notifications";
    }

    public async Task SendMessageAsync(string message)
    {
        try
        {
            var result = await _producer.ProduceAsync(_topic, new Message<Null, string> { Value = message });
            Console.WriteLine($"Kafka message sent to {result.TopicPartitionOffset}");
        }
        catch (ProduceException<Null, string> ex)
        {
            Console.WriteLine($"Kafka produce error: {ex.Error.Reason}");
        }
    }
}
