using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Domain.Repositories;

public interface IWorkflowRepository
{
    Task<Workflow> CreateAsync(Workflow workflow, CancellationToken cancellationToken = default);
    
    Task<Workflow?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<Workflow>> GetAllAsync(CancellationToken cancellationToken = default);
    
    Task<Workflow?> UpdateAsync(string id, Workflow workflow, CancellationToken cancellationToken = default);
    
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}

