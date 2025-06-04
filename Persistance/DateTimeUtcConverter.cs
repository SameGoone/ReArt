using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistance
{
	public class DateTimeUtcConverter : ValueConverter<DateTime, DateTime>
	{
		public DateTimeUtcConverter()
			: base(
				x => x.ToUniversalTime(), // How to save to DB (ensure UTC)
				x => x.ToLocalTime()) // How to read from DB (represent as local)
		{
		}
	}

	public class NullableDateTimeUtcConverter : ValueConverter<DateTime?, DateTime?>
	{
		public NullableDateTimeUtcConverter()
			: base(
				x => x.HasValue ? x.Value.ToUniversalTime() : x,
				x => x.HasValue ? x.Value.ToLocalTime() : x)
		{
		}
	}
}
