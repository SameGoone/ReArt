using Application.Images;
using Domain;

namespace Application.Users
{
	public class UserIdentityDto
	{
		public string Id { get; set; }
		public string DisplayName { get; set; }
		public ImageDto Image { get; set; }
		public string Token { get; set; }
	}
}
