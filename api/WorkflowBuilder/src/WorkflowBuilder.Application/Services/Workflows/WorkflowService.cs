using WorkflowBuilder.Application.Mappings;
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
            UpdatedAt = DateTime.UtcNow,
            IsPublished = false
        };

        var createdWorkflow = await workflowRepository.CreateAsync(workflow, cancellationToken);

        return createdWorkflow.ToResponse();
    }

    public async Task<WorkflowResponse?> GetWorkflowByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var workflow = await workflowRepository.GetByIdAsync(id, cancellationToken);
        
        if (workflow is null)
        {
            return null;
        }

        return workflow.ToResponse();
    }

    public async Task<IEnumerable<WorkflowResponse>> GetAllWorkflowsAsync(CancellationToken cancellationToken = default)
    {
        var workflows = await workflowRepository.GetAllAsync(cancellationToken);
        
        return workflows.Select(w => w.ToResponse()).ToList();
    }

    public async Task<WorkflowResponse?> UpdateWorkflowAsync(string id, UpdateWorkflowRequest request, CancellationToken cancellationToken = default)
    {
        var existingWorkflow = await workflowRepository.GetByIdAsync(id, cancellationToken);
        
        if (existingWorkflow is null)
        {
            return null;
        }
        
        if (request.Name is not null)
        {
            existingWorkflow.Name = request.Name;
        }

        if (request.Description is not null)
        {
            existingWorkflow.Description = request.Description;
        }

        if (request.Trigger is not null)
        {
            existingWorkflow.Trigger = request.Trigger.ToEntity();
        }

        if (request.Nodes is not null)
        {
            existingWorkflow.Nodes = request.Nodes.Select(n => n.ToEntity()).ToList();
        }

        if (request.Connections is not null)
        {
            existingWorkflow.Connections = request.Connections.Select(c => c.ToEntity()).ToList();
        }

        existingWorkflow.UpdatedAt = DateTime.UtcNow;

        var updatedWorkflow = await workflowRepository.UpdateAsync(id, existingWorkflow, cancellationToken);

        if (updatedWorkflow is null)
        {
            return null;
        }

        return updatedWorkflow.ToResponse();
    }

    public async Task<WorkflowResponse?> PublishWorkflowAsync(string id, CancellationToken cancellationToken = default)
    {
        var existingWorkflow = await workflowRepository.GetByIdAsync(id, cancellationToken);
        
        if (existingWorkflow is null)
        {
            return null;
        }
        
        existingWorkflow.IsPublished = true;
        existingWorkflow.UpdatedAt = DateTime.UtcNow;

        var updatedWorkflow = await workflowRepository.UpdateAsync(id, existingWorkflow, cancellationToken);

        if (updatedWorkflow is null)
        {
            return null;
        }

        return updatedWorkflow.ToResponse();
    }
}

