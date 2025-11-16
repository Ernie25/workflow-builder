using System.Net;
using System.Reflection;
using Microsoft.AspNetCore.Server.Kestrel.Https;
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

builder.Services.AddCors(options =>
{
  options.AddPolicy(
    "AllowAll",
    builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
  );
});

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAll");

app.Run();