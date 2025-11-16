using MongoDB.Bson;
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

  public async Task<ExecutionNodeResponse?> ContinueExecutionAsnyc(string workflowId, Dictionary<string, object>? context, CancellationToken ct)
  {
    var executionWorkflow = await executionRepo.GetAsync(workflowId, ct) ?? throw new InvalidOperationException("Workflow not found");
    executionWorkflow.Status = ExecutionStatus.Running;
    if (context is not null)
    {
      executionWorkflow.Context = DictionaryToBson(context);
    }
    var nodeFinished = executionWorkflow.Steps.First(q => q.Status == ExecutionStatus.Pending);
    nodeFinished.Status = ExecutionStatus.Pending;
    nodeFinished.FinishedAt = DateTime.UtcNow;
    await executionRepo.UpdateAsync(executionWorkflow, ct);

    var workflow = await workflowRepo.GetByIdAsync(executionWorkflow.WorkflowId, ct) ??  throw new InvalidOperationException("Workflow not found");
    var nextNodeId = workflow.Connections.FirstOrDefault(q => q.From == nodeFinished.NodeId)?.To;

    if (nextNodeId is null)
    {
      return null;
    }
    
    var nextNode = workflow.Nodes.First(q => q.Id == nextNodeId);
    
    await ProcessNode(nextNode, executionWorkflow, ct);
    
    return nodeFinished.ToResponse();
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

  private BsonDocument DictionaryToBson(Dictionary<string, object> dictionary)
  {
    var jsonDoc = Newtonsoft.Json.JsonConvert.SerializeObject(dictionary);
    return MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(jsonDoc);
  }
}