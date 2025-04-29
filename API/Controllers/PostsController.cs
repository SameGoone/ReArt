using Application.Posts;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	public class PostsController : BaseApiController
	{
		[HttpGet]
		public async Task<IActionResult> GetPosts()
		{
			return HandleResult(
				await Mediator.Send(new List.Query()));
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetPost(Guid id)
		{
			return HandleResult(
				await Mediator.Send(new Details.Query { Id = id }));
		}

		[HttpPost]
		public async Task<IActionResult> CreatePost(PostCreateDto post)
		{
			return HandleResult(
				await Mediator.Send(new Create.Command { Post = post }));
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> EditPost(Guid id, PostCreateDto post)
		{
			post.Id = id;
			return HandleResult(
				await Mediator.Send(new Edit.Command { Post = post }));
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeletePost(Guid id)
		{
			return HandleResult(
				await Mediator.Send(new Delete.Command { Id = id }));
		}
	}
}