using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class WorkflowConnection
{
    [BsonElement("from")]
    public string From { get; set; } = string.Empty;

    [BsonElement("to")]
    public string To { get; set; } = string.Empty;

    [BsonElement("condition")]
    [BsonIgnoreIfNull]
    public ConnectionCondition? Condition { get; set; }
}

