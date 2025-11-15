using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using WorkflowBuilder.Application.Services.ExecutionWorkflows;
using WorkflowBuilder.Application.WorkflowEngine;

namespace WorkflowBuilder.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ExecutionWorkflowsController(IWorkflowEngine engine, IExecutionWorkflowService service) : ControllerBase
{
  [Route("{workflowId}/trigger")]
  [HttpPost]
  public async Task<IActionResult> CreateExecutionWorkflow(string workflowId, CancellationToken ct)
  {
    var id = await engine.StartExecutionAsync(workflowId, ct);
    return Ok(id);
  }

  [HttpGet]
  public async Task<IActionResult> GetExecutionWorkflows(CancellationToken ct)
  {
    var workflows = await service.GetExecutionWorkflowsAsync(ct);
    return Ok(workflows);
  }
  
  [HttpGet]
  [Route("{workflowId}")]
  public async Task<IActionResult> GetExecutionWorkflows(string workflowId, CancellationToken ct)
  {
    var workflows = await service.GetExecutionWorkflowAsync(workflowId, ct);
    return Ok(workflows);
  }

  [HttpPut]
  [Route("{workflowId}/form-submit")]
  public async Task<IActionResult> FormSubmitExecutionWorkflow(string workflowId, [FromBody] Dictionary<string, object> body, CancellationToken ct)
  {
    var id = await engine.ContinueExecutionAsnyc(workflowId, body, ct);
    
    return Ok(id);
  }
}