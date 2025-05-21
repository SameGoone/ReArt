//using Application.Core;
//using Application.Interfaces;
//using FluentValidation;
//using MediatR;
//using Microsoft.EntityFrameworkCore;
//using Persistence;

//namespace Application.Comments
//{
//	public class Delete
//	{
//		public class Command : IRequest<Result<CommentDto>>
//		{
//			public string Body { get; set; }
//			public Guid PostId { get; set; }
//		}

//		public class CommantValifator : AbstractValidator<Command>
//		{
//			public CommantValifator()
//			{
//				RuleFor(x => x.Body).NotEmpty();
//			}
//		}

//		public class Handler : IRequestHandler<Command, Result<CommentDto>>
//		{
//			private readonly DataContext _context;
//			private readonly IUserAccessor _userAccessor;

//			public Handler(DataContext context, IUserAccessor userAccessor)
//			{
//				_context = context;
//				_userAccessor = userAccessor;
//			}

//			public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
//			{
//				var userId = _userAccessor.GetUserId();
//				var user = await _context.Users.FindAsync(userId);
//				var post = await _context.Posts
//					.Include(x => x.Likes)
//					.FirstOrDefaultAsync(x => x.Id == request.PostId);

//				if (post == null)
//				{
//					return Result<LikesInfo>.Failure($"Post with Id {request.PostId} doesn't exist");
//				}

//				var like = post.Likes.FirstOrDefault(x => x.UserId == userId);

//				if (like == null)
//				{
//					return Result<LikesInfo>.Success(new LikesInfo
//					{
//						Count = post.Likes.Count,
//						IsLiked = false
//					});
//				}

//				_context.Remove(like);
//				var result = await _context.SaveChangesAsync() > 0;

//				if (!result)
//					return Result<LikesInfo>.Failure("Failed to delete like");

//				return Result<LikesInfo>.Success(new LikesInfo
//				{
//					Count = post.Likes.Count,
//					IsLiked = false
//				});
//			}
//		}
//	}
//}