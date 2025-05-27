using Application.Comments;
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
			CreateMap<Post, PostDetailsDto>();
			CreateMap<PostCreateDto, Post>();
			CreateMap<Comment, CommentDto>();
		}
	}
}