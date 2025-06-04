using Application.Core;
using Application.Interfaces;
using Application.Likes;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
	public class Create
	{
		public class Command : IRequest<Result<CommentDto>>
		{
			public string Body { get; set; }
			public Guid PostId { get; set; }
		}

		public class CommandValidator : AbstractValidator<Command>
		{
			public CommandValidator()
			{
				RuleFor(x => x.Body).NotEmpty();
			}
		}

		public class Handler : IRequestHandler<Command, Result<CommentDto>>
		{
			private readonly DataContext _context;
			private readonly IUserAccessor _userAccessor;
			private readonly IMapper _mapper;

			public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
			{
				_context = context;
				_userAccessor = userAccessor;
				_mapper = mapper;
			}

			public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
			{
				var userResult = await _userAccessor.GetCurrentUser();
                if (!userResult.IsSuccess)
				{
					return Result<CommentDto>.Copy(userResult);
				}

                var comment = new Comment
				{
					Body = request.Body,
					Author = userResult.Value,
					PostId = request.PostId,
				};

				_context.Comments.Add(comment);
				var result = await _context.SaveChangesAsync() > 0;

				if (!result)
					return Result<CommentDto>.Failure("Failed to create comment");

				return Result<CommentDto>.Success(
					_mapper.Map<CommentDto>(comment));
			}
		}
	}
}