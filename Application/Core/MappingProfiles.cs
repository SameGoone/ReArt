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
			CreateMap<Post, PostDetailsDto>()
				.ForMember(d => d.User, o => o.MapFrom(s => s.User.DisplayName));
			CreateMap<PostCreateDto, Post>();
		}
	}
}