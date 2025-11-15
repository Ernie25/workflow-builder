namespace WorkflowBuilder.Application.WorkflowEngine;

public record NodeJob(string ExecutionId, string NodeId, object? Input);