using MongoDB.Driver;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Repositories;

namespace WorkflowBuilder.Infrastructure.Repositories;

public sealed class WorkflowRepository : IWorkflowRepository
{
    private readonly IMongoCollection<Workflow> _collection;

    public WorkflowRepository(IMongoCollection<Workflow> collection)
    {
        _collection = collection;
    }

    public async Task<Workflow> CreateAsync(Workflow workflow, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(workflow, cancellationToken: cancellationToken);
        return workflow;
    }

    public async Task<Workflow?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Workflow>.Filter.Eq(w => w.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<Workflow>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _collection.Find(Builders<Workflow>.Filter.Empty)
            .ToListAsync(cancellationToken);
    }

    public async Task<Workflow?> UpdateAsync(string id, Workflow workflow, CancellationToken cancellationToken = default)
    {
        workflow.Id = id;
        workflow.UpdatedAt = DateTime.UtcNow;
        
        var filter = Builders<Workflow>.Filter.Eq(w => w.Id, id);
        var result = await _collection.ReplaceOneAsync(filter, workflow, cancellationToken: cancellationToken);
        
        return result.ModifiedCount > 0 ? workflow : null;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Workflow>.Filter.Eq(w => w.Id, id);
        var result = await _collection.DeleteOneAsync(filter, cancellationToken);
        return result.DeletedCount > 0;
    }
}

