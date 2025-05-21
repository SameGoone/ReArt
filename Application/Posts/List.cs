using Application.Core;
using Application.Interfaces;
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
			private readonly IUserAccessor _userAccessor;

			public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
			{
				_context = context;
				_mapper = mapper;
				_userAccessor = userAccessor;
			}

			public async Task<Result<List<PostDetailsDto>>> Handle(Query request, CancellationToken cancellationToken)
			{
				var userId = _userAccessor.GetUserId();
				var result = new List<PostDetailsDto>();

				foreach (var post in _context.Posts
					.Include(x => x.User)
					.Include(x => x.Image)
					.Include(x => x.Likes))
				{
					var postDto = _mapper.Map<PostDetailsDto>(post);
					postDto.LikesInfo = new Likes.LikesInfo
					{
						Count = post.Likes?.Count ?? 0,
						IsLiked = post.Likes?.Any(x => x.UserId == userId) ?? false,
					};
					result.Add(postDto);
				}

				return Result<List<PostDetailsDto>>.Success(result);
			}
		}
	}
}