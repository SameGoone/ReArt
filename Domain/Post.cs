namespace Domain
{
	public class Post
	{
		public Guid Id { get; set; }
		public string Body { get; set; }
		public DateTime CreatedOn { get; set; }
		public AppUser User { get; set; }
        public Image Image { get; set; }
    }
}