using Microsoft.Extensions.DependencyInjection;

namespace WorkflowBuilder.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationDependencies(this IServiceCollection services)
    {
        return services;
    }
}