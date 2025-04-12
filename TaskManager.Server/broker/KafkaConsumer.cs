using Confluent.Kafka;
using System;
using System.Threading;

public class KafkaConsumer
{
    public void StartConsuming(string topic, string bootstrapServers, string groupId)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = bootstrapServers,
            GroupId = groupId,
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
        consumer.Subscribe(topic);

        Console.WriteLine($"👂 Слушаю топик: {topic}");

        while (true)
        {
            var result = consumer.Consume(CancellationToken.None);
            Console.WriteLine($"📨 Получено: {result.Message.Value}");
        }
    }
}
