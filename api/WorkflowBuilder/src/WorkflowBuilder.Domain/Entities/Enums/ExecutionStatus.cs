namespace WorkflowBuilder.Domain.Entities.Enums;

public enum ExecutionStatus
{
  NotStarted,
  Pending,
  Running,
  Succeeded,
  Failed,
  Cancelled
}
