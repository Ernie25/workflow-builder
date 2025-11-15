using Microsoft.AspNetCore.Mvc;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Application.Services.Chat;

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
        try
        {
            var response = await _chatService.ProcessChatAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (ArgumentException ex) when (ex.Message.Contains("not found"))
        {
            _logger.LogWarning(ex, "Workflow not found for chat request. WorkflowId: {WorkflowId}", request.WorkflowId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing chat request.");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "An error occurred while processing your request." });
        }
    }
}

