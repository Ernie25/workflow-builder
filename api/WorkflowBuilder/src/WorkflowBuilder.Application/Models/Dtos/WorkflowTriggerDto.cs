namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record WorkflowTriggerDto
{
    public required string Type { get; init; }
    
    public required string NodeId { get; init; }
}

