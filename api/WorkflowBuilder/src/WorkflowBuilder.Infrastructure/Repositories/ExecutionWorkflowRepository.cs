using MongoDB.Driver;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Repositories;

namespace WorkflowBuilder.Infrastructure.Repositories;

public class ExecutionWorkflowRepository(IMongoCollection<ExecutionWorkflow> collection) : IExecutionWorkflowRepository
{

  public async Task<ExecutionWorkflow> CreateAsync(ExecutionWorkflow execution, CancellationToken ct = default)
  {
    await collection.InsertOneAsync(execution, cancellationToken: ct);
    return execution;
  }

  public Task UpdateAsync(ExecutionWorkflow execution, CancellationToken ct = default)
  {
    throw new NotImplementedException();
  }

  public Task<ExecutionWorkflow?> GetAsync(Guid id, CancellationToken ct = default)
  {
    throw new NotImplementedException();
  }
}