using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Application.WorkflowEngine;

public interface IWorkflowEngine
{
  Task<ExecutionNodeResponse> StartExecutionAsync(
    string workflowId,
    CancellationToken ct = default);

  Task<ExecutionNodeResponse?> ContinueExecutionAsnyc(string workflowId, Dictionary<string, object>? context, CancellationToken ct);
}