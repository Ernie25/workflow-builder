using Microsoft.Extensions.DependencyInjection;
using WorkflowBuilder.Application.Services.Chat;
using WorkflowBuilder.Application.Services.Workflows;
using WorkflowBuilder.Application.WorkflowEngine;

namespace WorkflowBuilder.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationDependencies(this IServiceCollection services)
    {
      return services
        .AddServices();
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IWorkflowService, WorkflowService>();
        services.AddScoped<IWorkflowEngine, WorkflowEngine.WorkflowEngine>();
        services.AddScoped<IChatService, ChatService>();
        return services;
    }
}