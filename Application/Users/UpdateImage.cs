using Application.Core;
using Application.Images;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class UpdateImage
	{
		public class Command : IRequest<Result<Unit>>
		{
			public string UserId { get; set; }
			public ImageDto Image { get; set; }
		}

		public class CommandValidator : AbstractValidator<Command>
		{
			public CommandValidator()
			{
				RuleFor(x => x.UserId).NotEmpty();
				RuleFor(x => x.Image).SetValidator(new ImageValidator());
			}
		}

		public class Handler : IRequestHandler<Command, Result<Unit>>
		{
			private readonly UserManager<AppUser> _userManager;
			private readonly DataContext _context;
			private readonly IMapper _mapper;

			public Handler(UserManager<AppUser> userManager, DataContext context, IMapper mapper)
			{
				_userManager = userManager;
				_context = context;
				_mapper = mapper;
			}

			public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
			{
				var user = await _userManager.Users
					.Include(u => u.Image)
					.SingleOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

				if (user == null)
					return Result<Unit>.Failure($"The User with id {request.UserId} does not exists");

				if (user.Image != null)
				{
					_context.Images.Remove(user.Image);
				}
				user.Image = _mapper.Map<Image>(request.Image);

				var result = await _userManager.UpdateAsync(user);

				if (!result.Succeeded)
					return Result<Unit>.Failure("Failed to set user picture");

				return Result<Unit>.Success(Unit.Value);
			}
		}
	}
}