using Domain;

namespace Application.Posts
{
	public class PostCreateDto
	{
		public Guid Id { get; set; }
		public string Body { get; set; }
		public DateTime CreatedOn { get; set; }
		public Image Image { get; set; }
	}
}
