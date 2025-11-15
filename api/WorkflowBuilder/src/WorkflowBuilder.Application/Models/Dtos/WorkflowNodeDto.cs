namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record WorkflowNodeDto
{
    public required string Id { get; init; }
    
    public required string Type { get; init; }
    
    public required string Name { get; init; }
    
    public NodePositionDto? Position { get; init; }
    
    public string? Credentials { get; init; }
    
    public Dictionary<string, object>? Config { get; init; }
    
    public NodeRuntimeDto? Runtime { get; init; }
    
    public string? Notes { get; init; }
}

public sealed record NodePositionDto
{
    public int X { get; init; }
    
    public int Y { get; init; }
}

public sealed record NodeRuntimeDto
{
    public RetryConfigDto? Retry { get; init; }
    
    public int TimeoutMs { get; init; } = 30000;
    
    public bool ContinueOnError { get; init; } = false;
}

public sealed record RetryConfigDto
{
    public int Max { get; init; }
    
    public int DelayMs { get; init; }
}

