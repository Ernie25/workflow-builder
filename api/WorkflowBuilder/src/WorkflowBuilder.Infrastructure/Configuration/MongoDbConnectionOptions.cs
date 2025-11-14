namespace WorkflowBuilder.Infrastructure.Configuration;

public class MongoDbConnectionOptions
{
    public string ConnectionString { get; set; } = string.Empty;
    
    public string DatabaseName { get; set; } = string.Empty;
}

