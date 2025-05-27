
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace API
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.

			builder.Services.AddControllers(opt =>
			{
				var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
				opt.Filters.Add(new AuthorizeFilter(policy));
			});
			builder.Services.AddApplicationServices(builder.Configuration);
			builder.Services.AddIdentityServices(builder.Configuration);

			var app = builder.Build();

			app.UseMiddleware<ExceptionMiddleware>();

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseCors("CorsPolicy");

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseAuthorization();


			app.MapControllers();
			app.MapHub<CommentHub>("/comments");

			app.Run();
		}
	}
}
