using System.Collections.Concurrent;
using MongoDB.Driver;
using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Infrastructure.Data;

public static class WorkflowCollectionSetup
{
    private static readonly ConcurrentDictionary<string, bool> _initializedDatabases = new();

    public static void ConfigureWorkflowCollection(IMongoDatabase database)
    {
        var databaseName = database.DatabaseNamespace.DatabaseName;
        
        if (_initializedDatabases.TryAdd(databaseName, true))
        {
            var collection = database.GetCollection<Workflow>(Collections.Workflows);

            var indexKeys = Builders<Workflow>.IndexKeys
                .Ascending(w => w.Name)
                .Descending(w => w.CreatedAt);

            var indexOptions = new CreateIndexOptions
            {
                Name = "idx_workflow_name_active_created"
            };

            var indexModel = new CreateIndexModel<Workflow>(indexKeys, indexOptions);
            
            try
            {
                collection.Indexes.CreateOne(indexModel);
            }
            catch
            {
                // Index might already exist, ignore
            }

            // Create unique index on name (if needed - adjust based on requirements)
            // var uniqueIndexKeys = Builders<Workflow>.IndexKeys.Ascending(w => w.Name);
            // var uniqueIndexOptions = new CreateIndexOptions { Unique = true, Name = "idx_workflow_name_unique" };
            // collection.Indexes.CreateOne(new CreateIndexModel<Workflow>(uniqueIndexKeys, uniqueIndexOptions));
        }
    }
}

