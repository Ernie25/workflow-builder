using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WorkflowBuilder.Domain.Entities;

public sealed record ExecutionNode
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; init; }
  
  [BsonElement("executionId")]
  public string ExecutionId { get; init; }

  [BsonElement("nodeId")]
  public string NodeId { get; init; }

  [BsonElement("startedAt")]
  public DateTime StartedAt { get; init; }

  [BsonElement("finishedAt")]
  [BsonIgnoreIfNull]
  public DateTime? FinishedAt { get; init; }

  [BsonElement("status")]
  public string Status { get; init; }

  [BsonElement("input")]
  public object? Input { get; init; }

  [BsonElement("output")]
  public object? Output { get; init; }

  [BsonElement("error")]
  public string? Error { get; init; }
}