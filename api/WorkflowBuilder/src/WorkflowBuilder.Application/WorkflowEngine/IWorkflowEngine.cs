namespace WorkflowBuilder.Api.Application;

public interface IWorkflowEngine
{
  Task<string> StartExecutionAsync(
    Guid workflowId,
    int? version,
    object? triggerInput,
    CancellationToken ct = default);

  // Task ResumeExecutionFromFormAsync(
  //   Guid executionId,
  //   Guid formTaskId,
  //   IDictionary<string, object> submittedData,
  //   CancellationToken ct = default);
}