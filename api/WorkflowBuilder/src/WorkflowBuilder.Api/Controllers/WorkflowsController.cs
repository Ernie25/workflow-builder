using Microsoft.AspNetCore.Mvc;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Application.Services.Workflows;

namespace WorkflowBuilder.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class WorkflowsController : ControllerBase
{
    private readonly IWorkflowService _workflowService;

    public WorkflowsController(IWorkflowService workflowService)
    {
        _workflowService = workflowService;
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(WorkflowResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateWorkflow(CancellationToken cancellationToken)
    {
        var workflow = await _workflowService.CreateWorkflowAsync(cancellationToken);
        return Ok(workflow);
    }
    
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<WorkflowResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllWorkflows(CancellationToken cancellationToken)
    {
        var workflows = await _workflowService.GetAllWorkflowsAsync(cancellationToken);
        return Ok(workflows);
    }
    
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(WorkflowResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetWorkflow(string id, CancellationToken cancellationToken)
    {
        var workflow = await _workflowService.GetWorkflowByIdAsync(id, cancellationToken);
        
        if (workflow == null)
        {
            return NotFound();
        }

        return Ok(workflow);
    }
    
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(WorkflowResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateWorkflow(
        string id, 
        [FromBody] UpdateWorkflowRequest request, 
        CancellationToken cancellationToken)
    {
        var workflow = await _workflowService.UpdateWorkflowAsync(id, request, cancellationToken);
        
        if (workflow == null)
        {
            return NotFound();
        }

        return Ok(workflow);
    }
}


