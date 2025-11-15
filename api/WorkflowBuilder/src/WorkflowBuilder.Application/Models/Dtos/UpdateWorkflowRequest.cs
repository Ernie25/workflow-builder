namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record UpdateWorkflowRequest
{
    public string? Name { get; init; }
    
    public string? Description { get; init; }
    
    public WorkflowTriggerDto? Trigger { get; init; }
    
    public List<WorkflowNodeDto>? Nodes { get; init; }
    
    public List<WorkflowConnectionDto>? Connections { get; init; }
}

