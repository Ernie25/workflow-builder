using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WorkflowBuilder.Infrastructure.Options;

namespace WorkflowBuilder.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services, IConfiguration configuration)
    {
      return services
        .AddConfigurations(configuration)
        .SetupMongoDb();
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
}