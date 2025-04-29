using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
	public class List
	{
		public class Query : IRequest<Result<List<PostDetailsDto>>> { }

		public class Handler : IRequestHandler<Query, Result<List<PostDetailsDto>>>
		{
			private readonly DataContext _context;
			private readonly IMapper _mapper;

			public Handler(DataContext context, IMapper mapper)
			{
				_context = context;
				_mapper = mapper;
			}

			public async Task<Result<List<PostDetailsDto>>> Handle(Query request, CancellationToken cancellationToken)
			{
				var posts = await _context.Posts
					.ProjectTo<PostDetailsDto>(_mapper.ConfigurationProvider)
					.ToListAsync();

				return Result<List<PostDetailsDto>>.Success(posts);
			}
		}
	}
}