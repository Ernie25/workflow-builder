using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using WorkflowBuilder.Api.Application;
using WorkflowBuilder.Application.WorkflowEngine;

namespace WorkflowBuilder.Api.Controllers;

[ApiController]
[Route("webhook/{workflowId:guid}/{*path}")]
public class WebhookController(IWorkflowEngine engine) : ControllerBase
{
  [HttpPost]
  public async Task<IActionResult> HandleWebhook(Guid workflowId, string? path)
  {
    var body = await new StreamReader(Request.Body).ReadToEndAsync();
    var triggerInput = new
    {
      body = JsonSerializer.Deserialize<object>(body),
      headers = Request.Headers.ToDictionary(h => h.Key, h => (object)h.Value.ToString()),
      query = Request.Query.ToDictionary(q => q.Key, q => (object)q.Value.ToString()),
      path = path
    };

    await engine.StartExecutionAsync(workflowId, null, triggerInput);

    return Ok("OK"); // or depend on webhook node's response config
  }
}