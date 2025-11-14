namespace WorkflowBuilder.Domain.Entities;

public sealed record NodeExecution
{
  public Guid Id { get; init; }

  public Guid ExecutionId { get; init; }

  public string NodeId { get; init; }

  public DateTime StartedAt { get; init; }

  public DateTime? FinishedAt { get; init; }

  public string Status { get; init; }

  public object? Input { get; init; }

  public object? Output { get; init; }

  public string? Error { get; init; }
}