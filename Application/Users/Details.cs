using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
	public class Details
	{
		public class Query : IRequest<Result<UserDetailsDto>>
		{
			public string Id { get; set; }
		}

		public class Handler : IRequestHandler<Query, Result<UserDetailsDto>>
		{
			private readonly DataContext _context;
			private readonly IMapper _mapper;
			private readonly IUserAccessor _userAccessor;

			public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
			{
				_context = context;
				_mapper = mapper;
				_userAccessor = userAccessor;
			}

			public async Task<Result<UserDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
			{
				var userId = _userAccessor.GetUserId();

				var user = await _context.Users
					.Include(x => x.Image)
					.FirstOrDefaultAsync(x => x.Id == request.Id);

				var userDto = _mapper.Map<UserDetailsDto>(user);

				return Result<UserDetailsDto>.Success(userDto);
			}
		}
	}
}