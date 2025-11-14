using MongoDB.Bson.Serialization.Attributes;
using WorkflowBuilder.Domain.Entities.Enums;

namespace WorkflowBuilder.Domain.Entities;

public sealed record WorkflowExecution
{
  [BsonId]
  public string Id { get; init; }
  
  [BsonId]
  public string WorkflowId { get; init; }
  
  public ExecutionStatus Status { get; init; }
  
  public DateTime StartedAt { get; init; }
  
  public DateTime? FinishedAt { get; init; }
  
  public object? Context { get; init; }
  
  public IReadOnlyList<NodeExecution> Steps { get; init; }
};