using Microsoft.AspNetCore.Identity;

namespace Domain
{
	public class AppUser : IdentityUser
	{
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public string DisplayName { get; set; }
		public string Bio { get; set; }
		public Guid? ImageId { get; set; }
		public Image Image { get; set; }
    }
}
