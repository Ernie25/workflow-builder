using Microsoft.Extensions.DependencyInjection;

namespace WorkflowBuilder.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
    {
        return services;
    } 
}