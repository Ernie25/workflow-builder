namespace WorkflowBuilder.Api.Extensions;

public static class EnvironmentExtensions
{
    public static string GetEnvironmentName()
    {
        return Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT")
               ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
    }

    public static bool IsDevelopmentEnvironment()
    {
        var environmentName = GetEnvironmentName();
        return environmentName.Equals("Development", StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsProductionEnvironment()
    {
        var environmentName = GetEnvironmentName();
        return environmentName.Equals("Production", StringComparison.OrdinalIgnoreCase);
    }
}