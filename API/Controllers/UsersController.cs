using API.Services;
using Application.Users;
using AutoMapper;
using Domain;
using MediatR;
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

		public UsersController(UserManager<AppUser> userManager, TokenService tokenService, IMapper mapper)
		{
			_userManager = userManager;
			_tokenService = tokenService;
			_mapper = mapper;
		}

		[AllowAnonymous]
		[HttpPost("login")]
		public async Task<ActionResult<UserDetailsDto>> Login(LoginDto loginDto)
		{
			var user = await _userManager.FindByEmailAsync(loginDto.Email);

			if (user == null)
				return Unauthorized();

			var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
			if (result)
			{
				return CreateUserObject(user);
			}

			return Unauthorized();
		}

		[AllowAnonymous]
		[HttpPost("register")]
		public async Task <ActionResult<UserDetailsDto>> Register(RegisterDto registerDto)
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
				return CreateUserObject(user);
			}

			return BadRequest(result.Errors);
		}

		[HttpGet]
		public async Task<ActionResult<UserDetailsDto>> GetCurrentUser()
		{
			var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

			return CreateUserObject(user);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetUser(string id)
		{
			return HandleResult(
				await Mediator.Send(new Details.Query { Id = id }));
		}

		private UserDetailsDto CreateUserObject(AppUser user)
		{
			var userDto = _mapper.Map<UserDetailsDto>(user);
			userDto.Token = _tokenService.CreateToken(user);
			return userDto;
		}
	}
}
