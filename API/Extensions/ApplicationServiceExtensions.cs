using Application.Core;
using Application.Interfaces;
using Application.Posts;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
	public static class ApplicationServiceExtensions
	{
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
		{
			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			services.AddEndpointsApiExplorer();
			services.AddSwaggerGen(option =>
			{
				option.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

				// This is the crucial part: Define the security scheme for JWT
				option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					In = ParameterLocation.Header, // Location of the parameter is in the header
					Description = "Please enter a valid token", // Description for the user
					Name = "Authorization", // Name of the header parameter
					Type = SecuritySchemeType.Http, // Type of the security scheme is HTTP
					BearerFormat = "JWT", // The format of the token is JWT
					Scheme = "Bearer" // The scheme is "Bearer"
				});

				// This tells Swagger to require the "Bearer" scheme for endpoints
				option.AddSecurityRequirement(new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference // Reference the security scheme we defined
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer" // The ID of the security scheme
							}
						},
						new string[] { } // Specify the required scopes (empty for just requiring the token)
					}
				});
			});
			services.AddDbContext<DataContext>(opt =>
			{
				opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
			});
			services.AddCors(opt =>
			{
				opt.AddPolicy("CorsPolicy", policy =>
				{
					policy.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials()
						.WithOrigins("http://localhost:3000", "https://localhost:3000");
				});
			});
			services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
			services.AddAutoMapper(typeof(MappingProfiles).Assembly);
			services.AddFluentValidationAutoValidation();
			services.AddValidatorsFromAssemblyContaining<Create>();
			services.AddHttpContextAccessor();
			services.AddScoped<IUserAccessor, UserAccessor>();
			services.AddSignalR();

			return services;
		}
	}
}
