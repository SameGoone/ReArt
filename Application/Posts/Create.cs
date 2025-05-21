using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
	public class Create
	{
		public class Command : IRequest<Result<Unit>>
		{
			public PostCreateDto Post { get; set; }
		}

		public class CommandValidator : AbstractValidator<Command>
		{
			public CommandValidator()
			{
				RuleFor(x => x.Post).SetValidator(new PostValidator());
			}
		}

		public class Handler : IRequestHandler<Command, Result<Unit>>
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

			public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
			{
				var newPost = new Post();
				_mapper.Map(request.Post, newPost);

				var user = await _context.Users
					.FirstOrDefaultAsync(x => x.Id == _userAccessor.GetUserId());
				newPost.User = user;

				_context.Add(newPost);
				var result = await _context.SaveChangesAsync() > 0;

				if (!result)
					return Result<Unit>.Failure("Failed to create post");

				return Result<Unit>.Success(Unit.Value);
			}
		}
	}
}