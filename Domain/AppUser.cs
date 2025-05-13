using Microsoft.AspNetCore.Identity;

namespace Domain
{
	public class AppUser : IdentityUser
	{
		public DateTime CreatedOn { get; set; }
		public string DisplayName { get; set; }
		public string Bio { get; set; }
			
        //public ICollection<Like> Likes { get; set; }
    }
}
