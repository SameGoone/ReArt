using Application.Likes;
using Domain;

namespace Application.Posts
{
	public class PostDetailsDto
	{
		public Guid Id { get; set; }
		public string Body { get; set; }
		public DateTime CreatedOn { get; set; }
		public UserDto User { get; set; }
		public Image Image { get; set; }
		public LikesInfo LikesInfo { get; set; }
	}
}
