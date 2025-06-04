using API.Services;
using Application.Images;
using Application.Interfaces;
using Application.Users;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
	public class UsersController : BaseApiController
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly TokenService _tokenService;
		private readonly IMapper _mapper;
		private readonly IUserAccessor _userAccessor;

		public UsersController(UserManager<AppUser> userManager, TokenService tokenService, IMapper mapper, IUserAccessor userAccessor)
		{
			_userManager = userManager;
			_tokenService = tokenService;
			_mapper = mapper;
			_userAccessor = userAccessor;
		}

		[AllowAnonymous]
		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto loginDto)
		{
			var user = await _userManager.FindByEmailAsync(loginDto.Email);

			if (user == null)
				return Unauthorized();

			var check = await _userManager.CheckPasswordAsync(user, loginDto.Password);
			if (check)
			{
				return await GetDetailedIdentity(user.Id);
			}

			return Unauthorized();
		}

		[AllowAnonymous]
		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterDto registerDto)
		{
			if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
			{
				ModelState.AddModelError("Username", "Username is already taken");
				return ValidationProblem();
			}
			if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
			{
				ModelState.AddModelError("Email", "Email is already taken");
				return ValidationProblem();
			}

			var user = new AppUser
			{
				DisplayName = registerDto.DisplayName,
				Email = registerDto.Email,
				UserName = registerDto.Username,
			};

			var result = await _userManager.CreateAsync(user, registerDto.Password);

			if (result.Succeeded)
			{
				return await GetDetailedIdentity(user.Id);
			}

			return BadRequest(result.Errors);
		}

		[HttpGet]
		public async Task<IActionResult> GetCurrentUser()
		{
			return await GetDetailedIdentity(User.FindFirstValue(ClaimTypes.NameIdentifier));
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<UserDetailsDto>> GetUser(string id)
		{
			var result = HandleResult(
				await _userAccessor.GetUser(id));

			if (result is OkObjectResult okResult)
			{
				var user = (AppUser)okResult.Value;
				okResult.Value = _mapper.Map<UserDetailsDto>(user);
				return okResult;
			}
			else
			{
				return result;
			}
		}

		[HttpPost("{id}/image")]
		public async Task<IActionResult> UpdateImage(string id, [FromBody] ImageDto image)
		{
			return HandleResult(
				await Mediator.Send(new UpdateImage.Command { UserId = id, Image = image }));
		}

		private async Task<IActionResult> GetDetailedIdentity(string userId)
		{
			var result = HandleResult(
				await _userAccessor.GetUser(userId));

			if (result is OkObjectResult okResult)
			{
				var user = (AppUser)okResult.Value;
				okResult.Value = CreateIdentityDto(user);
				return okResult;
			}
			else
			{
				return result;
			}
		}

		private UserIdentityDto CreateIdentityDto(AppUser user)
		{
			var userDto = _mapper.Map<UserIdentityDto>(user);
			userDto.Token = _tokenService.CreateToken(user);
			return userDto;
		}
	}
}