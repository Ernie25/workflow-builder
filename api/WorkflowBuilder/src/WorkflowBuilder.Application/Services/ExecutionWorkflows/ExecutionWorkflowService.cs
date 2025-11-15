using WorkflowBuilder.Application.Mappings;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Repositories;

namespace WorkflowBuilder.Application.Services.ExecutionWorkflows;

public class ExecutionWorkflowService(IExecutionWorkflowRepository repository) : IExecutionWorkflowService
{

  public async Task<List<ExecutionWorkflowResponse>> GetExecutionWorkflowsAsync(CancellationToken cancellationToken = default)
  {
    var executionWorkflows = await repository.GetAllAsync(cancellationToken);
    
    return executionWorkflows.Select(q => q.ToResponse()).ToList();
  }

  public async Task<ExecutionWorkflowResponse?> GetExecutionWorkflowAsync(string executionWorkflowId, CancellationToken cancellationToken = default)
  {    
    var executionWorkflow = await repository.GetAsync(executionWorkflowId, cancellationToken);
    
    return executionWorkflow?.ToResponse();
  }
}