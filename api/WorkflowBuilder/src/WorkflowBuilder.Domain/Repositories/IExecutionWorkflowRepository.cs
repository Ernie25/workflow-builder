using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Domain.Repositories;

public interface IExecutionWorkflowRepository
{
  Task<ExecutionWorkflow> CreateAsync(ExecutionWorkflow execution, CancellationToken ct = default);
  Task UpdateAsync(ExecutionWorkflow execution, CancellationToken ct = default);
  Task<ExecutionWorkflow?> GetAsync(Guid id, CancellationToken ct = default);
}