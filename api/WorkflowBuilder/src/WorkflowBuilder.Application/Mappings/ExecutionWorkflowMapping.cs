using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Application.Mappings;

public static class ExecutionWorkflowMapping
{
  public static ExecutionWorkflowResponse ToResponse(this ExecutionWorkflow workflow)
  {
    return new ExecutionWorkflowResponse
    {
      Id = workflow.Id,
      Name = workflow.Name,
      Description = workflow.Description,
      WorkflowId = workflow.WorkflowId,
      FinishedAt = workflow.FinishedAt,
      StartedAt = workflow.StartedAt,
      Status = workflow.Status,
      Steps = workflow.Steps.Select(q => q.ToResponse()).ToList(),
    };
  }

  public static ExecutionNodeResponse ToResponse(this ExecutionNode node)
  {
    return new ExecutionNodeResponse
    {
      Name = node.Name,
      Status = node.Status,
      Config = node.Config.ToDictionary(),
      Type = node.Type,
      StartedAt = node.StartedAt,
      FinishedAt = node.FinishedAt,
      NodeId = node.NodeId,
    };
  }
}