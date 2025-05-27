using Domain;

namespace Application.Users
{
	public class UserDetailsDto
	{
		public string Id { get; set; }
		public DateTime CreatedAt { get; set; }
		public string Username { get; set; }
		public string DisplayName { get; set; }
		public Image Image { get; set; }
		public string Email { get; set; }
		public string Token { get; set; }
		public string Bio { get; set; }
	}
}
