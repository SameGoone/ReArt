namespace Domain
{
    public class Like : BaseEntity
	{
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public Guid PostId { get; set; }
		public Post Post { get; set; }
    }
}
