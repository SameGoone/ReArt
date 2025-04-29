using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
	public class Details
	{
		public class Query : IRequest<Result<PostDetailsDto>>
		{
			public Guid Id { get; set; }
		}

		public class Handler : IRequestHandler<Query, Result<PostDetailsDto>>
		{
			private readonly DataContext _context;
			private readonly IMapper _mapper;

			public Handler(DataContext context, IMapper mapper)
			{
				_context = context;
				_mapper = mapper;
			}

			public async Task<Result<PostDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
			{
				var post = await _context.Posts
					.ProjectTo<PostDetailsDto>(_mapper.ConfigurationProvider)
					.FirstOrDefaultAsync(x => x.Id == request.Id);

				return Result<PostDetailsDto>.Success(post);
			}
		}
	}
}