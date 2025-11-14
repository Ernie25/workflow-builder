using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class RetryConfig
{
    [BsonElement("max")]
    public int Max { get; set; }

    [BsonElement("delayMs")]
    public int DelayMs { get; set; }
}

