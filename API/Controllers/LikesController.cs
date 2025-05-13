using Application.Likes;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

	public class LikesController : BaseApiController
	{
		public class LikeRequest
		{
			public Guid PostId { get; set; }
		}

		[HttpPost]
		public async Task<IActionResult> CreateLike([FromBody] LikeRequest request)
		{
			return HandleResult(
				await Mediator.Send(new Create.Command { PostId = request.PostId }));
		}

		[HttpDelete("{postId}")]
		public async Task<IActionResult> DeleteLike(Guid postId)
		{
			return HandleResult(
				await Mediator.Send(new Delete.Command { PostId = postId }));
		}
	}
}