using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Application.Repositories;

public interface IExecutionWorkflowRepository
{
  Task<WorkflowExecution> CreateAsync(WorkflowExecution execution, CancellationToken ct = default);
  Task UpdateAsync(WorkflowExecution execution, CancellationToken ct = default);
  Task<WorkflowExecution?> GetAsync(Guid id, CancellationToken ct = default);
}