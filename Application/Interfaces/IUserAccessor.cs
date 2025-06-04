using Application.Core;
using Application.Users;
using Domain;

namespace Application.Interfaces
{
	public interface IUserAccessor
	{
		string GetUserId();

		Task<Result<AppUser>> GetUser(string userId);
		Task<Result<AppUser>> GetCurrentUser();
	}
}
