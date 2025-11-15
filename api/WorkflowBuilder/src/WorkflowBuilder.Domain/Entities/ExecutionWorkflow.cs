using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using WorkflowBuilder.Domain.Entities.Enums;

namespace WorkflowBuilder.Domain.Entities;

public sealed record ExecutionWorkflow
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; init; }
  
  [BsonElement("workflowId")]
  public string WorkflowId { get; init; }
  
  [BsonElement("status")]
  public ExecutionStatus Status { get; init; }
  
  [BsonElement("startedAt")]
  public DateTime StartedAt { get; init; }
  
  [BsonElement("finishedAt")]
  [BsonIgnoreIfNull]
  public DateTime? FinishedAt { get; init; }
  
  [BsonElement("context")]
  [BsonIgnoreIfNull]
  public object? Context { get; init; }
  
  [BsonElement("steps")]
  public IReadOnlyList<ExecutionNode> Steps { get; init; }
};