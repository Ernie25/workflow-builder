using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using WorkflowBuilder.Domain.Entities.Enums;

namespace WorkflowBuilder.Domain.Entities;

public sealed record ExecutionNode
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; }
  
  [BsonElement("executionId")]
  public string ExecutionId { get; set; }

  [BsonElement("nodeId")]
  public string NodeId { get; set; }
  
  [BsonElement("name")]
  public string Name { get; set; }

  [BsonElement("type")]
  public string Type { get; set; }
  
  [BsonElement("config")]
  public BsonDocument? Config { get; set; }

  [BsonElement("startedAt")]
  public DateTime StartedAt { get; set; }

  [BsonElement("finishedAt")]
  [BsonIgnoreIfNull]
  public DateTime? FinishedAt { get; set; }

  [BsonElement("status")]
  public ExecutionStatus Status { get; set; }
}