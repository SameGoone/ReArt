using Application.Comments;
using Application.Images;
using Application.Posts;
using Application.Users;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
	{
		public MappingProfiles()
		{
			CreateMap<Post, Post>();
			CreateMap<AppUser, UserDetailsDto>();
			CreateMap<AppUser, UserIdentityDto>();
			CreateMap<Post, PostDetailsDto>();
			CreateMap<PostCreateDto, Post>();
			CreateMap<Comment, CommentDto>();
			CreateMap<ImageDto, Image>();
			CreateMap<Image, ImageDto>();
		}
	}
}