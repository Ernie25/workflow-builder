using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed class NodePosition
{
    [BsonElement("x")]
    public int X { get; set; }

    [BsonElement("y")]
    public int Y { get; set; }
}

