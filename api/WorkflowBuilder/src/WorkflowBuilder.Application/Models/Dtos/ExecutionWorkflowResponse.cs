using WorkflowBuilder.Domain.Entities.Enums;

namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record ExecutionWorkflowResponse
{
  public string Id { get; set; }

  public string Name { get; set; }

  public string? Description { get; set; }

  public string WorkflowId { get; set; }

  public Dictionary<string, object> Context { get; set; }
  
  public ExecutionStatus Status { get; set; }
  
  public DateTime StartedAt { get; set; }
  
  public DateTime? FinishedAt { get; set; }

  public List<ExecutionNodeResponse> Steps { get; set; } = [];
}

public sealed record ExecutionNodeResponse
{
  public string NodeId { get; set; }
  
  public string Name { get; set; }

  public string Type { get; set; }
  
  public Dictionary<string, object>? Config { get; init; }

  public DateTime StartedAt { get; set; }

  public DateTime? FinishedAt { get; set; }

  public ExecutionStatus Status { get; set; }
}