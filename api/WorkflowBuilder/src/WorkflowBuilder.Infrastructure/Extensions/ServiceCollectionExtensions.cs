using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Repositories;
using WorkflowBuilder.Infrastructure.Data;
using WorkflowBuilder.Infrastructure.Options;
using WorkflowBuilder.Infrastructure.Repositories;
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
        .AddRepositories();
    }
    
    private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
    {
      services.AddOptions<MongoDbConnectionOptions>().Bind(configuration.GetSection(nameof(MongoDbConnectionOptions)));

      return services;
    }

    private static IServiceCollection SetupMongoDb(this IServiceCollection services)
    {
      services.AddSingleton<IMongoClient>(serviceProvider =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<MongoDbConnectionOptions>>().Value;
      
        var user = Environment.GetEnvironmentVariable("DB_MONGO_USER");
        var password = Environment.GetEnvironmentVariable("DB_MONGO_PASSWORD");
        var host  = Environment.GetEnvironmentVariable("DB_MONGO_HOST");

        if (user is not null && password is not null && host is not null)
        {
          var documentDbSettings = MongoClientSettings.FromUrl(new MongoUrl($"mongodb://{user}:{password}@{host}:27017/?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"));
          return new MongoClient(documentDbSettings);
        }
        
        if (string.IsNullOrWhiteSpace(options.ConnectionString))
        {
          throw new InvalidOperationException("MongoDB connection string is not configured.");
        }
            
        if (string.IsNullOrWhiteSpace(options.DatabaseName))
        {
          throw new InvalidOperationException("Database name is not configured.");
        }
            
        var clientSettings = MongoClientSettings.FromUrl(new MongoUrl(options.ConnectionString));
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

    private static MongoClient GetMongoClient()
    {
      var password = Environment.GetEnvironmentVariable("DB_MONGO_PSW") ?? "-";
      var connectionString = $"mongodb://apiuser:dSYiQK[Foa5bRVTM$4yREY~$kC6Z@workflowdb.cluster-cd8ugy4i616m.eu-north-1.docdb.amazonaws.com:27017/workflow-builder?tls=true&replicaSet=rs0&readpreference=secondaryPreferred";
      var pathToCaFile = "rds-combined-ca-bundle.pem";

      // ADD CA certificate to local trust store
      // DO this once - Maybe when your service starts
      var localTrustStore = new X509Store(StoreName.Root);
      var certificateCollection = new X509Certificate2Collection();
      certificateCollection.Import(pathToCaFile);
      try 
      {
        localTrustStore.Open(OpenFlags.ReadWrite);
        localTrustStore.AddRange(certificateCollection);
      } 
      catch (Exception ex) 
      {
        Console.WriteLine("Root certificate import failed: " + ex.Message);
        throw;
      } 
      finally 
      {
        localTrustStore.Close();
      }

      var settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
      return new MongoClient(settings);
    }
}