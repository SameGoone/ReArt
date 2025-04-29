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
			CreateMap<Post, PostDetailsDto>();
			CreateMap<PostCreateDto, Post>();
		}
	}
}