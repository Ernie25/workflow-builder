using WorkflowBuilder.Api.Application;
using WorkflowBuilder.Application.Repositories;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Entities.Enums;

namespace WorkflowBuilder.Application.WorkflowEngine;

public class WorkflowEngine(
  IWorkflowRepository workflowRepo, 
  IExecutionWorkflowRepository executionRepo
  // IJobQueue queue
  )
  : IWorkflowEngine
{
  public async Task<string> StartExecutionAsync(
    Guid workflowId,
    int? version,
    object? triggerInput,
    CancellationToken ct = default)
  {
    var workflow = await workflowRepo.GetAsync(workflowId, version, ct)
                   ?? throw new InvalidOperationException("Workflow not found");

    var execution = new WorkflowExecution
    {
      WorkflowId = workflow.Id,
      Status = ExecutionStatus.Pending,
      StartedAt = DateTime.UtcNow,
      FinishedAt = null,
      Context = null,
      Steps = []
    };

    await executionRepo.CreateAsync(execution, ct);

    // enqueue first node
    // await _queue.EnqueueAsync(new NodeJob(
    //   execution.Id,
    //   workflow.Trigger!.NodeId,
    //   triggerInput
    // ), ct);

    return execution.Id;
  }
}