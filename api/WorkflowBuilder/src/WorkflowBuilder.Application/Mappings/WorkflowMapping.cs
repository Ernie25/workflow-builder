using System.Text.Json;
using MongoDB.Bson;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Application.Mappings;

public static class WorkflowMapping
{
    public static WorkflowResponse ToResponse(this Workflow workflow)
    {
        return new WorkflowResponse
        {
            Id = workflow.Id,
            Name = workflow.Name,
            Description = workflow.Description,
            Trigger = workflow.Trigger?.ToDto(),
            Nodes = workflow.Nodes.Select(n => n.ToDto()).ToList(),
            Connections = workflow.Connections.Select(c => c.ToDto()).ToList(),
            CreatedAt = workflow.CreatedAt,
            UpdatedAt = workflow.UpdatedAt
        };
    }

    public static WorkflowTriggerDto? ToDto(this WorkflowTrigger? trigger)
    {
        if (trigger is null) return null;
        
        return new WorkflowTriggerDto
        {
            Type = trigger.Type,
            NodeId = trigger.NodeId
        };
    }

    public static WorkflowTrigger? ToEntity(this WorkflowTriggerDto? dto)
    {
        if (dto is null) return null;
        
        return new WorkflowTrigger
        {
            Type = dto.Type,
            NodeId = dto.NodeId
        };
    }

    public static WorkflowNodeDto ToDto(this WorkflowNode node)
    {
        return new WorkflowNodeDto
        {
            Id = node.Id,
            Type = node.Type,
            Name = node.Name,
            Position = node.Position?.ToDto(),
            Credentials = node.Credentials,
            Config = node.Config?.ToDictionary(),
            Runtime = node.Runtime?.ToDto(),
            Notes = node.Notes
        };
    }

    public static WorkflowNode ToEntity(this WorkflowNodeDto dto)
    {
        return new WorkflowNode
        {
            Id = dto.Id,
            Type = dto.Type,
            Name = dto.Name,
            Position = dto.Position?.ToEntity(),
            Credentials = dto.Credentials,
            Config = dto.Config?.ToBsonDocument(),
            Runtime = dto.Runtime?.ToEntity(),
            Notes = dto.Notes
        };
    }

    public static NodePositionDto? ToDto(this NodePosition? position)
    {
        if (position is null) return null;
        
        return new NodePositionDto
        {
            X = position.X,
            Y = position.Y
        };
    }

    public static NodePosition? ToEntity(this NodePositionDto? dto)
    {
        if (dto is null) return null;
        
        return new NodePosition
        {
            X = dto.X,
            Y = dto.Y
        };
    }

    public static NodeRuntimeDto? ToDto(this NodeRuntime? runtime)
    {
        if (runtime is null) return null;
        
        return new NodeRuntimeDto
        {
            Retry = runtime.Retry?.ToDto(),
            TimeoutMs = runtime.TimeoutMs,
            ContinueOnError = runtime.ContinueOnError
        };
    }

    public static NodeRuntime? ToEntity(this NodeRuntimeDto? dto)
    {
        if (dto is null) return null;
        
        return new NodeRuntime
        {
            Retry = dto.Retry?.ToEntity(),
            TimeoutMs = dto.TimeoutMs,
            ContinueOnError = dto.ContinueOnError
        };
    }

    public static RetryConfigDto? ToDto(this RetryConfig? retry)
    {
        if (retry is null) return null;
        
        return new RetryConfigDto
        {
            Max = retry.Max,
            DelayMs = retry.DelayMs
        };
    }

    public static RetryConfig? ToEntity(this RetryConfigDto? dto)
    {
        if (dto is null) return null;
        
        return new RetryConfig
        {
            Max = dto.Max,
            DelayMs = dto.DelayMs
        };
    }

    public static WorkflowConnectionDto ToDto(this WorkflowConnection connection)
    {
        return new WorkflowConnectionDto
        {
            From = connection.From,
            To = connection.To,
            Condition = connection.Condition?.ToDto()
        };
    }

    public static WorkflowConnection ToEntity(this WorkflowConnectionDto dto)
    {
        return new WorkflowConnection
        {
            From = dto.From,
            To = dto.To,
            Condition = dto.Condition?.ToEntity()
        };
    }

    public static ConnectionConditionDto? ToDto(this ConnectionCondition? condition)
    {
        if (condition is null) return null;
        
        return new ConnectionConditionDto
        {
            Type = condition.Type,
            Expression = condition.Expression
        };
    }

    public static ConnectionCondition? ToEntity(this ConnectionConditionDto? dto)
    {
        if (dto is null) return null;
        
        return new ConnectionCondition
        {
            Type = dto.Type,
            Expression = dto.Expression
        };
    }

    // Convert BsonDocument to Dictionary<string, object>
    private static Dictionary<string, object>? ToDictionary(this BsonDocument? bsonDocument)
    {
        if (bsonDocument is null) return null;
        
        var json = bsonDocument.ToJson();
        return JsonSerializer.Deserialize<Dictionary<string, object>>(json);
    }

    // Convert Dictionary<string, object> to BsonDocument
    private static BsonDocument? ToBsonDocument(this Dictionary<string, object>? dictionary)
    {
        if (dictionary is null) return null;
        
        var json = JsonSerializer.Serialize(dictionary);
        return BsonDocument.Parse(json);
    }
}

