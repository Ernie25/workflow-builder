using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Domain.Repositories;

public interface IExecutionWorkflowRepository
{
  Task<ExecutionWorkflow> CreateAsync(ExecutionWorkflow execution, CancellationToken ct = default);
  Task<ExecutionWorkflow?> UpdateAsync(ExecutionWorkflow execution, CancellationToken ct = default);
  Task<ExecutionWorkflow?> GetAsync(string id, CancellationToken ct = default);
  Task<List<ExecutionWorkflow>> GetAllAsync(CancellationToken ct = default);
}