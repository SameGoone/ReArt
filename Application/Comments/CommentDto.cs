using Application.Posts;

namespace Application.Comments
{
	public class CommentDto
	{
		public Guid Id { get; set; }
		public string Body { get; set; }
		public DateTime CreatedAt { get; set; }
		public UserDto Author { get; set; }
	}
}
