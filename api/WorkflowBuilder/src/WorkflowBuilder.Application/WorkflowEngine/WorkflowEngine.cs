using WorkflowBuilder.Application.Mappings;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Entities.Enums;
using WorkflowBuilder.Domain.Repositories;

namespace WorkflowBuilder.Application.WorkflowEngine;

public class WorkflowEngine(
  IWorkflowRepository workflowRepo, 
  IExecutionWorkflowRepository executionRepo
  )
  : IWorkflowEngine
{
  public async Task<ExecutionNodeResponse> StartExecutionAsync(
    string workflowId,
    CancellationToken ct = default)
  {
    var workflow = await workflowRepo.GetByIdAsync(workflowId, ct)
                   ?? throw new InvalidOperationException("Workflow not found");

    if (workflow.Trigger?.NodeId is null)
    {
      throw new InvalidOperationException("Trigger node not found");
    }

    var execution = new ExecutionWorkflow
    {
      WorkflowId = workflow.Id,
      Status = ExecutionStatus.Running,
      Name = workflow.Name,
      Description = workflow.Description,
      StartedAt = DateTime.UtcNow,
      FinishedAt = null,
      Context = null,
      Steps = workflow.Nodes.Select(q => new ExecutionNode
      {
        NodeId = q.Id,
        Name = q.Name,
        Config = q.Config,
        Type = q.Type,
        Status = ExecutionStatus.NotStarted,
        StartedAt = default,
        FinishedAt = null,
      }).ToList()
    };

    await executionRepo.CreateAsync(execution, ct);
    
    var triggerNode = workflow.Nodes.First(n => n.Id == workflow.Trigger.NodeId);
    
    var stoppedNode = await ProcessNode(triggerNode, execution, ct);

    return stoppedNode.ToResponse();
  }

  private async Task<ExecutionNode> ProcessNode(WorkflowNode node, ExecutionWorkflow execution, CancellationToken ct)
  {
    var executionNode = execution.Steps.First(s => s.NodeId == node.Id);
    switch (node.Type)
    {
      case "form":
        executionNode.Status = ExecutionStatus.Pending;
        execution.Status = ExecutionStatus.Pending;
        break;
      default:
        throw new ArgumentOutOfRangeException();
    }
    
    await executionRepo.UpdateAsync(execution, ct);
    
    return executionNode;
  }
}