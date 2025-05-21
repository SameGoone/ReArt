namespace Domain
{
	public class Comment : BaseEntity
	{
        public string Body { get; set; }
		public string AuthorId { get; set; }
		public AppUser Author { get; set; }
		public Guid PostId { get; set; }
		public Post Post { get; set; }
	}
}
