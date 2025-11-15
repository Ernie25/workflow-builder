namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record WorkflowResponse
{
    public required string Id { get; init; }
    
    public required string Name { get; init; }
    
    public string? Description { get; init; }
    
    public WorkflowTriggerDto? Trigger { get; init; }
    
    public List<WorkflowNodeDto> Nodes { get; init; } = new();
    
    public List<WorkflowConnectionDto> Connections { get; init; } = new();
        
    public bool IsPublished { get; init; }
    
    public DateTime CreatedAt { get; init; }
    
    public DateTime UpdatedAt { get; init; }
}

