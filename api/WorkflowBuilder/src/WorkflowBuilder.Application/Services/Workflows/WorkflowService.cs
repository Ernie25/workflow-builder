using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Repositories;

namespace WorkflowBuilder.Application.Services.Workflows;

public sealed class WorkflowService(IWorkflowRepository workflowRepository) : IWorkflowService
{
  public async Task<WorkflowResponse> CreateWorkflowAsync(CancellationToken cancellationToken = default)
    {
        var workflow = new Workflow
        {
            Name = "Untitled",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdWorkflow = await workflowRepository.CreateAsync(workflow, cancellationToken);

        return new WorkflowResponse
        {
            Id = createdWorkflow.Id,
            Name = createdWorkflow.Name,
            Description = createdWorkflow.Description,
            CreatedAt = createdWorkflow.CreatedAt,
            UpdatedAt = createdWorkflow.UpdatedAt
        };
    }

    public async Task<WorkflowResponse?> GetWorkflowByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var workflow = await workflowRepository.GetByIdAsync(id, cancellationToken);
        
        if (workflow is null)
        {
            return null;
        }

        return new WorkflowResponse
        {
            Id = workflow.Id,
            Name = workflow.Name,
            Description = workflow.Description,
            CreatedAt = workflow.CreatedAt,
            UpdatedAt = workflow.UpdatedAt
        };
    }

    public async Task<IEnumerable<WorkflowResponse>> GetAllWorkflowsAsync(CancellationToken cancellationToken = default)
    {
        var workflows = await workflowRepository.GetAllAsync(cancellationToken);
        
        return workflows.Select(w => new WorkflowResponse
        {
            Id = w.Id,
            Name = w.Name,
            Description = w.Description,
            CreatedAt = w.CreatedAt,
            UpdatedAt = w.UpdatedAt
        }).ToList();
    }
}

