using WorkflowBuilder.Application.Models.Dtos;

namespace WorkflowBuilder.Application.Services.Workflows;

public interface IWorkflowService
{
  Task<WorkflowResponse> CreateWorkflowAsync(CancellationToken cancellationToken = default);

  Task<WorkflowResponse?> GetWorkflowByIdAsync(string id, CancellationToken cancellationToken = default);

  Task<IEnumerable<WorkflowResponse>> GetAllWorkflowsAsync(CancellationToken cancellationToken = default);

  Task<WorkflowResponse?> UpdateWorkflowAsync(string id, UpdateWorkflowRequest request, CancellationToken cancellationToken = default);
}