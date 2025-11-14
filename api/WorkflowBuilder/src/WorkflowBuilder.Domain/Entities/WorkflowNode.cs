using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class WorkflowNode
{
    [BsonElement("id")]
    public string Id { get; set; } = string.Empty;

    [BsonElement("type")]
    public string Type { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("position")]
    public NodePosition? Position { get; set; }

    [BsonElement("credentials")]
    public string? Credentials { get; set; }

    [BsonElement("config")]
    [BsonIgnoreIfNull]
    public BsonDocument? Config { get; set; }

    [BsonElement("runtime")]
    [BsonIgnoreIfNull]
    public NodeRuntime? Runtime { get; set; }

    [BsonElement("notes")]
    [BsonIgnoreIfNull]
    public string? Notes { get; set; }
}

