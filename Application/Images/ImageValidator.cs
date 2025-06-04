using FluentValidation;

namespace Application.Images
{
    public class ImageValidator : AbstractValidator<ImageDto>
    {
        public ImageValidator()
        {
            RuleFor(x => x.Format).NotEmpty();
            RuleFor(x => x.Base64Data).NotEmpty();
        }
    }
}
