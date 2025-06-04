using Domain;
using FluentValidation;

namespace Application.Posts
{
	public class PostValidator : AbstractValidator<PostCreateDto>
	{
		public PostValidator()
		{
			RuleFor(x => x.Body).NotEmpty();
			RuleFor(x => x.Image).NotEmpty();
		}
	}
}
