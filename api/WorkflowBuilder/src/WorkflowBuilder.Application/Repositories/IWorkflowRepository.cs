using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Application.Repositories;

public interface IWorkflowRepository
{
  Task<Workflow?> GetAsync(Guid id, int? version = null, CancellationToken ct = default);
  Task SaveAsync(Workflow workflow, CancellationToken ct = default);
}