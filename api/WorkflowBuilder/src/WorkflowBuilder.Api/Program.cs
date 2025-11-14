using System.Reflection;
using Scalar.AspNetCore;
using WorkflowBuilder.Api.Extensions;
using WorkflowBuilder.Application.Extensions;
using WorkflowBuilder.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);
var environment = EnvironmentExtensions.GetEnvironmentName();

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .AddUserSecrets(Assembly.GetExecutingAssembly());

builder.Services
    .AddApiDependencies()
    .AddApplicationDependencies()
    .AddInfrastructureDependencies(builder.Configuration);

var app = builder.Build();

if (!EnvironmentExtensions.IsProductionEnvironment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();