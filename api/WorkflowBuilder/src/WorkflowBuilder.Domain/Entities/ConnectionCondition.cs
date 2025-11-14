using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class ConnectionCondition
{
    [BsonElement("type")]
    public string Type { get; set; } = string.Empty;

    [BsonElement("expression")]
    [BsonIgnoreIfNull]
    public string? Expression { get; set; }
}

