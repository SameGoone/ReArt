using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Persistance;
using System.Reflection.Emit;

namespace Persistence
{
	public class DataContext : IdentityDbContext<AppUser>
	{
		public DataContext(DbContextOptions options) : base(options)
		{
		}

		public DbSet<Post> Posts { get; set; }
		public DbSet<Image> Images { get; set; }
		public DbSet<Like> Likes { get; set; }
		public DbSet<Comment> Comments { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			foreach (var entityType in builder.Model.GetEntityTypes())
			{
				foreach (var property in entityType.GetProperties())
				{
					if (property.ClrType == typeof(DateTime))
					{
						property.SetValueConverter(new DateTimeUtcConverter());
					}
					else if (property.ClrType == typeof(DateTime?))
					{
						property.SetValueConverter(new NullableDateTimeUtcConverter());
					}
				}
			}

			builder.Entity<Comment>()
				.HasOne(x => x.Post)
				.WithMany(x => x.Comments)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<AppUser>()
				.HasOne(u => u.Image)
				.WithOne()
				.HasForeignKey<AppUser>(u => u.ImageId)
				.IsRequired(false)
				.OnDelete(DeleteBehavior.SetNull);
		}
	}
}