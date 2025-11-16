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
  
  public async Task<ExecutionWorkflow?> UpdateAsync(ExecutionWorkflow executionWorkflow, CancellationToken cancellationToken = default)
  {
    var filter = Builders<ExecutionWorkflow>.Filter.Eq(w => w.Id, executionWorkflow.Id);
    var result = await collection.ReplaceOneAsync(filter, executionWorkflow, cancellationToken: cancellationToken);
        
    return result.ModifiedCount > 0 ? executionWorkflow : null;
  }

  public async Task<ExecutionWorkflow?> GetAsync(string id, CancellationToken ct = default)
  {
    var filter = Builders<ExecutionWorkflow>.Filter.Eq(w => w.Id, id);
    return await collection.Find(filter).FirstOrDefaultAsync(ct);
  }

  public async Task<List<ExecutionWorkflow>> GetAllAsync(CancellationToken ct = default)
  {
    return await collection.Find(Builders<ExecutionWorkflow>.Filter.Empty)
      .ToListAsync(ct);
  }
}