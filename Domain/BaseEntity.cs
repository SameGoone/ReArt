namespace Domain
{
	public class BaseEntity
	{
		public Guid Id { get; set; }
		public DateTime CreatedOn { get; set; }

		public BaseEntity()
		{
			CreatedOn = DateTime.Now;
		}
	}
}
