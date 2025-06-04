using Application.Core;
using Application.Interfaces;
using AutoMapper;
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
			private readonly IUserAccessor _userAccessor;

			public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
			{
				_context = context;
				_mapper = mapper;
				_userAccessor = userAccessor;
			}

			public async Task<Result<PostDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
			{
				var userId = _userAccessor.GetUserId();

				var post = await _context.Posts
					.Include(x => x.User)
					.Include(x => x.Image)
					.Include(x => x.Likes)
					.FirstOrDefaultAsync(x => x.Id == request.Id);

				var postDto = _mapper.Map<PostDetailsDto>(post);
				postDto.LikesInfo = new Likes.LikesInfo
				{
					Count = post.Likes?.Count ?? 0,
					IsLiked = post.Likes?.Any(x => x.UserId == userId) ?? false,
				};

				return Result<PostDetailsDto>.Success(postDto);
			}
		}
	}
}