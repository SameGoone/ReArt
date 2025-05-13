using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Likes
{
    public class Delete
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

				var like = post.Likes.FirstOrDefault(x => x.UserId == userId);

				if (like == null)
				{
					return Result<LikesInfo>.Success(new LikesInfo
					{
						Count = post.Likes.Count,
						IsLiked = false
					});
				}

				_context.Remove(like);
				var result = await _context.SaveChangesAsync() > 0;

				if (!result)
					return Result<LikesInfo>.Failure("Failed to delete like");

				return Result<LikesInfo>.Success(new LikesInfo
				{
					Count = post.Likes.Count,
					IsLiked = false
				});
			}
		}
	}
}