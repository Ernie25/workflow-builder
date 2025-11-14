namespace WorkflowBuilder.Infrastructure.Options;

public sealed record MongoDbConnectionOptions
{
    public required string ConnectionString { get; init; }
    
    public required string DatabaseName { get; init; }
}

