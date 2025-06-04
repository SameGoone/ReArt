using Application.Images;
using Domain;

namespace Application.Posts
{
	public class PostCreateDto
	{
		public Guid? Id { get; set; }
		public string Body { get; set; }
		public ImageDto Image { get; set; }
	}
}
