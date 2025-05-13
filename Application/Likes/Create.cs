using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Likes
{
	public class Create
	{
		public class Command : IRequest<Result<LikesInfo>>
		{
			public Guid PostId { get; set; }
		}

		public class Handler : IRequestHandler<Command, Result<LikesInfo>>
		{
			private readonly DataContext _context;
			private readonly IUserAccessor _userAccessor;

			public Handler(DataContext context, IUserAccessor userAccessor)
			{
				_context = context;
				_userAccessor = userAccessor;
			}

			public async Task<Result<LikesInfo>> Handle(Command request, CancellationToken cancellationToken)
			{
				var userId = _userAccessor.GetUserId();
				var post = await _context.Posts
					.Include(x => x.Likes)
					.FirstOrDefaultAsync(x => x.Id == request.PostId);

                if (post == null)
                {
					return Result<LikesInfo>.Failure($"Post with Id {request.PostId} doesn't exist");
                }

                bool isLiked = false;
				if (post.Likes != null)
				{
					isLiked = post.Likes.Any(x => x.UserId == userId);
				}

				if (isLiked)
				{
					return Result<LikesInfo>.Success(new LikesInfo
					{
						Count = post.Likes.Count,
						IsLiked = true
					});
				}

				var like = new Like()
				{
					UserId = userId,
					PostId = request.PostId
				};
				_context.Add(like);
				var result = await _context.SaveChangesAsync() > 0;

				if (!result)
					return Result<LikesInfo>.Failure("Failed to create like");
				
				return Result<LikesInfo>.Success(new LikesInfo
				{
					Count = post.Likes.Count,
					IsLiked = true
				});
			}
		}
	}
}