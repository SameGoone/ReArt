using Application.Core;
using Application.Images;
using AutoMapper;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Posts
{
	public class Edit
	{
		public class Command : IRequest<Result<PostDetailsDto>>
		{
			public PostCreateDto Post { get; set; }
		}

		public class CommandValidator : AbstractValidator<Command>
		{
			public CommandValidator()
			{
				RuleFor(x => x.Post).SetValidator(new PostValidator());
				RuleFor(x => x.Post.Image).SetValidator(new ImageValidator());
			}
		}

		public class Handler : IRequestHandler<Command, Result<PostDetailsDto>>
		{
			private readonly DataContext _context;
			private readonly IMapper _mapper;
			private readonly IMediator _mediator;

			public Handler(DataContext context, IMapper mapper, IMediator mediator)
			{
				_context = context;
				_mapper = mapper;
				_mediator = mediator;
			}

			public async Task<Result<PostDetailsDto>> Handle(Command request, CancellationToken cancellationToken)
			{
				var post = await _context.Posts.FindAsync(request.Post.Id);

				if (post == null)
					return null;

				_mapper.Map(request.Post, post);
				var result = await _context.SaveChangesAsync() > 0;

				if (!result)
					return Result<PostDetailsDto>.Failure("Failed to update the post");

				return await _mediator.Send(new Details.Query { Id = post.Id });
			}
		}
	}
}