using WorkflowBuilder.Application.Repositories;
using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Infrastructure.Repositories;

public class ExecutionWorkflowRepository : IExecutionWorkflowRepository
{

  public Task<WorkflowExecution> CreateAsync(WorkflowExecution execution, CancellationToken ct = default)
  {
    throw new NotImplementedException();
  }

  public Task UpdateAsync(WorkflowExecution execution, CancellationToken ct = default)
  {
    throw new NotImplementedException();
  }

  public Task<WorkflowExecution?> GetAsync(Guid id, CancellationToken ct = default)
  {
    throw new NotImplementedException();
  }
}