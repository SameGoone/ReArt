namespace Domain
{
	public class Post : BaseEntity
	{
		public string Body { get; set; }
		public AppUser User { get; set; }
        public Image Image { get; set; }

		public ICollection<Like> Likes { get; set; } = new List<Like>();
		public ICollection<Comment> Comments { get; set; } = new List<Comment>();
	}
}