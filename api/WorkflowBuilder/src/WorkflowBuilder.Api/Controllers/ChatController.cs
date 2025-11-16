using Microsoft.AspNetCore.Mvc;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Application.Services.Chat;
using WorkflowBuilder.Domain.Enums;

namespace WorkflowBuilder.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        IChatService chatService,
        ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ProcessChat(
        [FromBody] ChatRequest request,
        CancellationToken cancellationToken)
    {
        // Check if the message contains "Create a flow", "Create flow", or "Create the flow" (case-insensitive)
        var message = request.Message ?? string.Empty;
        var lowerMessage = message.ToLowerInvariant();
        
        if (lowerMessage.Contains("create a flow") || 
            lowerMessage.Contains("create flow") || 
            lowerMessage.Contains("create the flow") || 
            lowerMessage.Contains("create a workflow") || 
            lowerMessage.Contains("create workflow") || 
            lowerMessage.Contains("create the workflow"))
        {
          
          Thread.Sleep(2500);
            // Return WorkflowManagement response with workflow structure
            var workflow = new WorkflowResponse
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Untitled",
                Description = null,
                Trigger = new WorkflowTriggerDto
                {
                    Type = "manual",
                    NodeId = ""
                },
                Nodes = new List<WorkflowNodeDto>
                {
                    new WorkflowNodeDto
                    {
                        Id = "node-1763286261816-owrdi5pjr",
                        Type = "trigger",
                        Name = "Trigger / Webhook",
                        Position = new NodePositionDto { X = 252, Y = 198 }
                    },
                    new WorkflowNodeDto
                    {
                        Id = "node-1763286266026-rhi49r9re",
                        Type = "form",
                        Name = "Form",
                        Position = new NodePositionDto { X = 529, Y = 196 }
                    },
                    new WorkflowNodeDto
                    {
                        Id = "node-1763286289462-dj9yoht4q",
                        Type = "action",
                        Name = "Action",
                        Position = new NodePositionDto { X = 844, Y = 185 }
                    },
                    new WorkflowNodeDto
                    {
                        Id = "node-1763286304096-2gdkblh4o",
                        Type = "decision",
                        Name = "Decision / Conditional",
                        Position = new NodePositionDto { X = 1158, Y = 177 }
                    },
                    new WorkflowNodeDto
                    {
                        Id = "node-1763286333198-q3xw3g6ge",
                        Type = "action",
                        Name = "Action",
                        Position = new NodePositionDto { X = 1510, Y = 38 }
                    },
                    new WorkflowNodeDto
                    {
                        Id = "node-1763286447749-rol0yjljr",
                        Type = "action",
                        Name = "Action",
                        Position = new NodePositionDto { X = 1525, Y = 310 }
                    }
                },
                Connections = new List<WorkflowConnectionDto>
                {
                    new WorkflowConnectionDto
                    {
                        From = "node-1763286261816-owrdi5pjr",
                        To = "node-1763286266026-rhi49r9re",
                        Condition = null
                    },
                    new WorkflowConnectionDto
                    {
                        From = "node-1763286266026-rhi49r9re",
                        To = "node-1763286289462-dj9yoht4q",
                        Condition = null
                    },
                    new WorkflowConnectionDto
                    {
                        From = "node-1763286289462-dj9yoht4q",
                        To = "node-1763286304096-2gdkblh4o",
                        Condition = null
                    },
                    new WorkflowConnectionDto
                    {
                        From = "node-1763286304096-2gdkblh4o",
                        To = "node-1763286333198-q3xw3g6ge",
                        Condition = new ConnectionConditionDto
                        {
                            Type = "true",
                            Expression = null
                        }
                    },
                    new WorkflowConnectionDto
                    {
                        From = "node-1763286304096-2gdkblh4o",
                        To = "node-1763286447749-rol0yjljr",
                        Condition = new ConnectionConditionDto
                        {
                            Type = "false",
                            Expression = null
                        }
                    }
                },
                CreatedAt = DateTime.Parse("2025-11-16T09:47:57.962Z"),
                UpdatedAt = DateTime.Parse("2025-11-16T09:47:57.962Z")
            };

            var response = new ChatResponse
            {
                Classification = ChatClassification.WorkflowManagement,
                ResponseMessage = "Workflow created successfully.",
                Workflow = workflow,
                SuggestedActions = null
            };

            return Ok(response);
        }

        // Return Question response with simple text
        var questionResponse = new ChatResponse
        {
            Classification = ChatClassification.Question,
            ResponseMessage = "How can I help you with your workflow?",
            Workflow = null,
            SuggestedActions = null
        };

        return Ok(questionResponse);

        // Original implementation commented out:
        // try
        // {
        //     var response = await _chatService.ProcessChatAsync(request, cancellationToken);
        //     return Ok(response);
        // }
        // catch (ArgumentException ex) when (ex.Message.Contains("not found"))
        // {
        //     _logger.LogWarning(ex, "Workflow not found for chat request. WorkflowId: {WorkflowId}", request.WorkflowId);
        //     return NotFound(new { error = ex.Message });
        // }
        // catch (Exception ex)
        // {
        //     _logger.LogError(ex, "Error processing chat request.");
        //     return StatusCode(
        //         StatusCodes.Status500InternalServerError,
        //         new { error = "An error occurred while processing your request." });
        // }
    }
}

