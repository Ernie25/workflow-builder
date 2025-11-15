using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using WorkflowBuilder.Application.WorkflowEngine;

namespace WorkflowBuilder.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ExecutionWorkflowController(IWorkflowEngine engine) : ControllerBase
{
  [Route("{workflowId}/{path}")]
  [HttpPost]
  public async Task<IActionResult> CreateWebHookExecutionWorkflow(string workflowId, string path)
  {
    var body = await new StreamReader(Request.Body).ReadToEndAsync();
    var triggerInput = new
    {
      body = JsonSerializer.Deserialize<object>(body),
      headers = Request.Headers.ToDictionary(h => h.Key, h => (object)h.Value.ToString()),
      query = Request.Query.ToDictionary(q => q.Key, q => (object)q.Value.ToString()),
      path = path
    };

    var id = await engine.StartExecutionAsync(workflowId, triggerInput);

    return Ok(id); // or depend on webhook node's response config
  }
}