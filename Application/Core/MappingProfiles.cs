using Application.Comments;
using Application.Posts;
using AutoMapper;
using Domain;

namespace Application.Core
{
	public class MappingProfiles : Profile
	{
		public MappingProfiles()
		{
			CreateMap<Post, Post>();
			CreateMap<AppUser, UserDto>();
			CreateMap<Post, PostDetailsDto>();
			CreateMap<PostCreateDto, Post>();
			CreateMap<Comment, CommentDto>();
		}
	}
}