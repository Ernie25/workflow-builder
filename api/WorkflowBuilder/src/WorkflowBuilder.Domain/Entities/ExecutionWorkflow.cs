using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using WorkflowBuilder.Domain.Entities.Enums;

namespace WorkflowBuilder.Domain.Entities;

public sealed record ExecutionWorkflow
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; }
  
  [BsonElement("workflowId")]
  public string WorkflowId { get; set; }
  
  [BsonElement("name")]
  public string Name { get; set; }
  
  [BsonElement("description")]
  [BsonIgnoreIfNull]
  public string? Description { get; set; }
  
  [BsonElement("status")]
  public ExecutionStatus Status { get; set; }
  
  [BsonElement("startedAt")]
  public DateTime StartedAt { get; set; }
  
  [BsonElement("finishedAt")]
  [BsonIgnoreIfNull]
  public DateTime? FinishedAt { get; set; }
  
  [BsonElement("context")]
  [BsonIgnoreIfNull]
  public BsonDocument? Context { get; set; }

  [BsonElement("steps")] 
  public IList<ExecutionNode> Steps { get; init; } = [];
};