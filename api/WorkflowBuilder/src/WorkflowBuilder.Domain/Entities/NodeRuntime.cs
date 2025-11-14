using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class NodeRuntime
{
    [BsonElement("retry")]
    [BsonIgnoreIfNull]
    public RetryConfig? Retry { get; set; }

    [BsonElement("timeoutMs")]
    public int TimeoutMs { get; set; } = 30000;

    [BsonElement("continueOnError")]
    public bool ContinueOnError { get; set; } = false;
}

