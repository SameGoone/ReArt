using Application.Users;

namespace Application.Comments
{
    public class CommentDto
	{
		public Guid Id { get; set; }
		public string Body { get; set; }
		public DateTime CreatedAt { get; set; }
		public UserDetailsDto Author { get; set; }
	}
}
