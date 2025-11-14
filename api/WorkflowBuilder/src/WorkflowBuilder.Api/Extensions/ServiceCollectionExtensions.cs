namespace WorkflowBuilder.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiDependencies(this IServiceCollection services)
    {
        return services
            .AddGeneralServices();
    }

    private static IServiceCollection AddGeneralServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddOpenApi();
        services.AddHealthChecks();
        services.AddRouting(options => options.LowercaseUrls = true);
        
        return services;
    }
}