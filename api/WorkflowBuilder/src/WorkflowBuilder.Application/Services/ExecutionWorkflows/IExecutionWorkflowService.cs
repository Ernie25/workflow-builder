using WorkflowBuilder.Application.Models.Dtos;

namespace WorkflowBuilder.Application.Services.ExecutionWorkflows;

public interface IExecutionWorkflowService
{
  Task<List<ExecutionWorkflowResponse>> GetExecutionWorkflowsAsync(CancellationToken cancellationToken = default);
  
  Task<ExecutionWorkflowResponse?> GetExecutionWorkflowAsync(string executionWorkflowId, CancellationToken cancellationToken = default);
}