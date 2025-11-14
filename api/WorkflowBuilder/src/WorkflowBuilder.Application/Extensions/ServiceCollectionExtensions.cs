using Microsoft.Extensions.DependencyInjection;
using WorkflowBuilder.Application.Services.Workflows;

namespace WorkflowBuilder.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationDependencies(this IServiceCollection services)
    {
        return services.AddServices();
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IWorkflowService, WorkflowService>();
        return services;
    }
}