using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class Workflow
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("isPublished")]
    public bool IsPublished { get; set; }
    
    [BsonElement("trigger")]
    public WorkflowTrigger? Trigger { get; set; }

    [BsonElement("nodes")]
    public List<WorkflowNode> Nodes { get; set; } = new();

    [BsonElement("connections")]
    public List<WorkflowConnection> Connections { get; set; } = new();
    
    [BsonElement("createdAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

