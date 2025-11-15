namespace WorkflowBuilder.Application.WorkflowEngine;

public interface IWorkflowEngine
{
  Task<string> StartExecutionAsync(
    string workflowId,
    object? triggerInput,
    CancellationToken ct = default);
}