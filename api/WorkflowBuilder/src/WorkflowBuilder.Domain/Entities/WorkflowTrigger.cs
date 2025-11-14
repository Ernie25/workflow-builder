using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class WorkflowTrigger
{
    [BsonElement("type")]
    public string Type { get; set; } = string.Empty;

    [BsonElement("nodeId")]
    public string NodeId { get; set; } = string.Empty;
}

