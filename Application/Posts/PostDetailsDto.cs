using Application.Images;
using Application.Likes;
using Application.Users;
using Domain;

namespace Application.Posts
{
    public class PostDetailsDto
	{
		public Guid Id { get; set; }
		public string Body { get; set; }
		public DateTime CreatedAt { get; set; }
		public UserDetailsDto User { get; set; }
		public ImageDto Image { get; set; }
		public LikesInfo LikesInfo { get; set; }
	}
}
