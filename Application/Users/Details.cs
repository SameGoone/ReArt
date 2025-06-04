using Application.Comments;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
	public class Details
	{
		public class Query : IRequest<Result<AppUser>>
		{
			public string Id { get; set; }
		}

		public class Handler : IRequestHandler<Query, Result<AppUser>>
		{
			private readonly DataContext _context;

			public Handler(DataContext context)
			{
				_context = context;
			}

			public async Task<Result<AppUser>> Handle(Query request, CancellationToken cancellationToken)
			{
				var user = await _context.Users
					.Include(x => x.Image)
					.FirstOrDefaultAsync(x => x.Id == request.Id);

				if (user is null)
					return Result<AppUser>.Failure($"User with id {request.Id} not exists");

				return Result<AppUser>.Success(user);
			}
		}
	}
}