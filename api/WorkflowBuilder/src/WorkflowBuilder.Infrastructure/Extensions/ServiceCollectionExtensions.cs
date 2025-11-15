using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Repositories;
using WorkflowBuilder.Domain.Services;
using WorkflowBuilder.Infrastructure.Data;
using WorkflowBuilder.Infrastructure.Options;
using WorkflowBuilder.Infrastructure.Repositories;
using WorkflowBuilder.Infrastructure.Services.Bedrock;
using IWorkflowRepository = WorkflowBuilder.Domain.Repositories.IWorkflowRepository;

namespace WorkflowBuilder.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services, IConfiguration configuration)
    {
      return services
        .AddConfigurations(configuration)
        .SetupMongoDb()
        .SetupCollections()
        .AddRepositories()
        .AddBedrockServices(configuration);
    }
    
    private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
    {
      services.AddOptions<MongoDbConnectionOptions>()
        .Bind(configuration.GetSection(nameof(MongoDbConnectionOptions)));
      services.AddOptions<BedrockOptions>()
        .Bind(configuration.GetSection(nameof(BedrockOptions)));

      return services;
    }

    private static IServiceCollection SetupMongoDb(this IServiceCollection services)
    {
      services.AddSingleton<IMongoClient>(serviceProvider =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<MongoDbConnectionOptions>>().Value;
        if (string.IsNullOrWhiteSpace(options.ConnectionString))
        {
          throw new InvalidOperationException("MongoDB connection string is not configured.");
        }
            
        if (string.IsNullOrWhiteSpace(options.DatabaseName))
        {
          throw new InvalidOperationException("Database name is not configured.");
        }
            
        var clientSettings = MongoClientSettings.FromConnectionString(options.ConnectionString);
        return new MongoClient(clientSettings);
      });

      services.AddSingleton<IMongoDatabase>(sp =>
      {
        var client = sp.GetRequiredService<IMongoClient>();
        var options = sp.GetRequiredService<IOptions<MongoDbConnectionOptions>>().Value;
        return client.GetDatabase(options.DatabaseName);
      });

      return services;
    }

    private static IServiceCollection SetupCollections(this IServiceCollection services)
    {
      services.AddScoped<IMongoCollection<Workflow>>(sp =>
      {
        var database = sp.GetRequiredService<IMongoDatabase>();
        var collection = database.GetCollection<Workflow>(Collections.Workflows);
        
        WorkflowCollectionSetup.ConfigureWorkflowCollection(database);
        
        return collection;
      });
      services.AddScoped<IMongoCollection<ExecutionWorkflow>>(sp =>
      {
        var database = sp.GetRequiredService<IMongoDatabase>();
        var collection = database.GetCollection<ExecutionWorkflow>(Collections.ExecutionWorkflows);
        return collection;
      });
      return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
      services.AddScoped<IWorkflowRepository, WorkflowRepository>();
      services.AddScoped<IExecutionWorkflowRepository, ExecutionWorkflowRepository>();
      
      return services;
    }

    private static IServiceCollection AddBedrockServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // TODO: Register AmazonBedrockRuntimeClient when implementing actual Bedrock integration
        // services.AddSingleton<AmazonBedrockRuntimeClient>(sp =>
        // {
        //     var options = sp.GetRequiredService<IOptions<BedrockOptions>>().Value;
        //     var config = new AmazonBedrockRuntimeConfig
        //     {
        //         RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(options.Region)
        //     };
        //     return new AmazonBedrockRuntimeClient(config);
        // });

        // Register Bedrock services
        services.AddSingleton<PromptBuilder>();
        services.AddScoped<IBedrockChatService, BedrockChatService>();

        return services;
    }
}