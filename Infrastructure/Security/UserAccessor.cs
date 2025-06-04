using Application.Core;
using Application.Interfaces;
using Application.Users;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using System.Security.Claims;

namespace Infrastructure.Security
{
	public class UserAccessor : IUserAccessor
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IMediator _mediator;
		private readonly IMapper _mapper;

		public UserAccessor(IHttpContextAccessor httpContextAccessor, IMediator mediator, IMapper mapper)
		{
			_httpContextAccessor = httpContextAccessor;
			_mediator = mediator;
			_mapper = mapper;
		}

		public Task<Result<AppUser>> GetCurrentUser()
		{
			var userId = GetUserId();
			return GetUser(userId);
		}

		public async Task<Result<AppUser>> GetUser(string userId)
		{
			var result = await _mediator.Send(new Details.Query { Id = userId });
			if (result.IsSuccess)
			{
				if (result.Value == null)
				{
					return Result<AppUser>.Failure($"User with id {userId} not found");
				}
				return result;
			}
			else
			{
				return result;
			}
		}

		public string GetUserId()
		{
			var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
			return userId;
		}
	}
}
