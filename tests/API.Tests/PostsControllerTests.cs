using API.Controllers;
using Application.Core;
using Application.Posts;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace API.Tests
{
	public class PostsControllerTests
	{
		private readonly Mock<IMediator> _mediatorMock;
		private readonly PostsController _controller;

		public PostsControllerTests()
		{
			_mediatorMock = new Mock<IMediator>();

			var serviceProviderMock = new Mock<IServiceProvider>();
			serviceProviderMock
				.Setup(sp => sp.GetService(typeof(IMediator)))
				.Returns(_mediatorMock.Object);

			var httpContextMock = new Mock<HttpContext>();
			httpContextMock
				.Setup(hc => hc.RequestServices)
				.Returns(serviceProviderMock.Object);

			_controller = new PostsController
			{
				ControllerContext = new ControllerContext
				{
					HttpContext = httpContextMock.Object
				}
			};
		}

		// Helper method to create a PostDetailsDto for tests
		private PostDetailsDto CreateSamplePostDetailsDto(Guid id = default)
		{
			return new PostDetailsDto
			{
				Id = id == default ? Guid.NewGuid() : id,
				Body = "Test Post Body",
				CreatedAt = DateTime.UtcNow,
				User = new Application.Users.UserDetailsDto
				{
					Id = "test-user-id-123",
					DisplayName = "Test User DisplayName",
					CreatedAt = DateTime.UtcNow.AddDays(-5),
					Image = new Application.Images.ImageDto
					{
						Format = "png", //
						Base64Data = "base64encodeduserimagedata..."
					},
					Email = "testuser@example.com",
					Bio = "This is a test user bio."
				},
				Image = new Application.Images.ImageDto
				{
					Format = "jpeg", //
					Base64Data = "base64encodedpostimagedata..."
				},
				LikesInfo = new Application.Likes.LikesInfo { Count = 0, IsLiked = false }
			};
		}

		#region --- GetPosts Tests ---

		[Fact]
		public async Task GetPosts_ReturnsOkObjectResult_WithListOfPosts_WhenSuccessful()
		{
			// Arrange
			var postsList = new List<PostDetailsDto>
			{
				CreateSamplePostDetailsDto(),
				CreateSamplePostDetailsDto()
			};
			var successResult = Result<List<PostDetailsDto>>.Success(postsList);
			_mediatorMock
				.Setup(m => m.Send(It.IsAny<List.Query>(), It.IsAny<CancellationToken>()))
				.ReturnsAsync(successResult);

			// Act
			var result = await _controller.GetPosts();

			// Assert
			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnValue = Assert.IsType<List<PostDetailsDto>>(okResult.Value);
			Assert.Equal(2, returnValue.Count);
			_mediatorMock.Verify(
				m => m.Send(
					It.IsAny<List.Query>(),
					It.IsAny<CancellationToken>()),
				Times.Once);
		}

		[Fact]
		public async Task GetPosts_ReturnsNotFoundResult_WhenResultIsSuccessButValueIsNull()
		{
			// Arrange
			var nullDataResult = Result<List<PostDetailsDto>>.Success(null);
			_mediatorMock
				.Setup(m => m.Send(
					It.IsAny<List.Query>(),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(nullDataResult);

			// Act
			var result = await _controller.GetPosts();

			// Assert
			Assert.IsType<NotFoundResult>(result);
		}

		[Fact]
		public async Task GetPosts_ReturnsBadRequestObjectResult_WhenResultIsFailure()
		{
			// Arrange
			var failureResult = Result<List<PostDetailsDto>>.Failure("Error fetching posts");
			_mediatorMock
				.Setup(m => m.Send(
					It.IsAny<List.Query>(),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(failureResult);

			// Act
			var result = await _controller.GetPosts();

			// Assert
			var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
			Assert.Equal("Error fetching posts", badRequestResult.Value);
		}

		#endregion

		#region --- GetPost(id) Tests ---

		[Fact]
		public async Task GetPost_ReturnsOkObjectResult_WithPost_WhenFoundAndSuccessful()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var postDto = CreateSamplePostDetailsDto(postId);
			var successResult = Result<PostDetailsDto>.Success(postDto);
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Details.Query>(q => q.Id == postId),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(successResult);

			// Act
			var result = await _controller.GetPost(postId);

			// Assert
			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnValue = Assert.IsType<PostDetailsDto>(okResult.Value);
			Assert.Equal(postId, returnValue.Id);
			Assert.Equal("Test User DisplayName", returnValue.User.DisplayName);
			Assert.Equal("jpeg", returnValue.Image.Format);
		}

		[Fact]
		public async Task GetPost_ReturnsNotFoundResult_WhenMediatorReturnsNullResult()
		{
			// Arrange
			var postId = Guid.NewGuid();
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Details.Query>(q => q.Id == postId),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync((Result<PostDetailsDto>)null);

			// Act
			var result = await _controller.GetPost(postId);

			// Assert
			Assert.IsType<NotFoundResult>(result);
		}

		[Fact]
		public async Task GetPost_ReturnsNotFoundResult_WhenResultIsSuccessButValueIsNull()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var successResultWithNull = Result<PostDetailsDto>.Success(null);
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Details.Query>(q => q.Id == postId),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(successResultWithNull);

			// Act
			var result = await _controller.GetPost(postId);

			// Assert
			Assert.IsType<NotFoundResult>(result);
		}

		[Fact]
		public async Task GetPost_ReturnsBadRequestObjectResult_WhenResultIsFailure()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var failureResult = Result<PostDetailsDto>.Failure("Error fetching post");
			_mediatorMock
				.Setup(m => m.Send(It.Is<Details.Query>(q => q.Id == postId), It.IsAny<CancellationToken>()))
				.ReturnsAsync(failureResult);

			// Act
			var result = await _controller.GetPost(postId);

			// Assert
			var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
			Assert.Equal("Error fetching post", badRequestResult.Value);
		}

		#endregion

		#region --- CreatePost Tests ---

		[Fact]
		public async Task CreatePost_ReturnsOkObjectResult_WithCreatedPost_WhenSuccessful()
		{
			// Arrange
			var createDto = new PostCreateDto { Body = "New Post" };
			var createdPostDto = CreateSamplePostDetailsDto();
			createdPostDto.Body = createDto.Body;

			var successResult = Result<PostDetailsDto>.Success(createdPostDto);
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Create.Command>(cmd => cmd.Post == createDto),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(successResult);

			// Act
			var result = await _controller.CreatePost(createDto);

			// Assert
			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnValue = Assert.IsType<PostDetailsDto>(okResult.Value);
			Assert.Equal(createdPostDto.Id, returnValue.Id);
			Assert.Equal("New Post", returnValue.Body);
			_mediatorMock.Verify(
				m => m.Send(
					It.Is<Create.Command>(cmd => cmd.Post == createDto),
					It.IsAny<CancellationToken>()),
				Times.Once);
		}

		[Fact]
		public async Task CreatePost_ReturnsBadRequestObjectResult_WhenResultIsFailure()
		{
			// Arrange
			var createDto = new PostCreateDto { Body = "New Post" };
			var failureResult = Result<PostDetailsDto>.Failure("Error creating post");
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Create.Command>(cmd => cmd.Post == createDto),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(failureResult);

			// Act
			var result = await _controller.CreatePost(createDto);

			// Assert
			var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
			Assert.Equal("Error creating post", badRequestResult.Value);
		}

		#endregion

		#region --- EditPost Tests ---

		[Fact]
		public async Task EditPost_ReturnsOkObjectResult_WithUpdatedPost_WhenSuccessful()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var editDto = new PostCreateDto { Body = "Updated Post" };
			var updatedPostDto = CreateSamplePostDetailsDto(postId);
			updatedPostDto.Body = "Updated Post";

			var successResult = Result<PostDetailsDto>.Success(updatedPostDto);

			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Application.Posts.Edit.Command>(cmd => cmd.Post.Id == postId && cmd.Post.Body == editDto.Body),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(successResult);

			// Act
			var result = await _controller.EditPost(postId, editDto);

			// Assert
			Assert.NotNull(editDto.Id);
			Assert.Equal(postId, editDto.Id.Value);

			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnValue = Assert.IsType<PostDetailsDto>(okResult.Value);
			Assert.Equal(postId, returnValue.Id);
			Assert.Equal("Updated Post", returnValue.Body);
			_mediatorMock.Verify(
				m => m.Send(
					It.Is<Application.Posts.Edit.Command>(cmd => cmd.Post.Id == postId && cmd.Post.Body == editDto.Body),
					It.IsAny<CancellationToken>()),
				Times.Once);
		}

		[Fact]
		public async Task EditPost_ReturnsNotFoundResult_WhenMediatorReturnsNullResult()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var editDto = new PostCreateDto { Body = "Updated Post" };
			_mediatorMock
			   .Setup(m => m.Send(It.Is<Application.Posts.Edit.Command>(cmd => cmd.Post.Id == postId), It.IsAny<CancellationToken>()))
			   .ReturnsAsync((Result<PostDetailsDto>)null);

			// Act
			var result = await _controller.EditPost(postId, editDto);

			// Assert
			Assert.IsType<NotFoundResult>(result);
		}


		[Fact]
		public async Task EditPost_ReturnsBadRequestObjectResult_WhenResultIsFailure()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var editDto = new PostCreateDto { Body = "Updated Post" };
			var failureResult = Result<PostDetailsDto>.Failure("Error updating post");
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Application.Posts.Edit.Command>(cmd => cmd.Post.Id == postId && cmd.Post.Body == editDto.Body),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(failureResult);

			// Act
			var result = await _controller.EditPost(postId, editDto);

			// Assert
			var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
			Assert.Equal("Error updating post", badRequestResult.Value);
		}

		#endregion

		#region --- DeletePost Tests ---

		[Fact]
		public async Task DeletePost_ReturnsOkObjectResult_WithUnitValue_WhenSuccessful()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var successResult = Result<Unit>.Success(Unit.Value);
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Delete.Command>(cmd => cmd.Id == postId),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(successResult);

			// Act
			var result = await _controller.DeletePost(postId);

			// Assert
			var okResult = Assert.IsType<OkObjectResult>(result);
			Assert.Equal(Unit.Value, okResult.Value);
			_mediatorMock.Verify(
				m => m.Send(
					It.Is<Delete.Command>(cmd => cmd.Id == postId),
					It.IsAny<CancellationToken>()),
				Times.Once);
		}

		[Fact]
		public async Task DeletePost_ReturnsNotFoundResult_WhenMediatorReturnsNullResult()
		{
			// Arrange
			var postId = Guid.NewGuid();
			_mediatorMock
			   .Setup(m => m.Send(
				   It.Is<Delete.Command>(cmd => cmd.Id == postId),
				   It.IsAny<CancellationToken>()))
			   .ReturnsAsync((Result<Unit>)null);

			// Act
			var result = await _controller.DeletePost(postId);

			// Assert
			Assert.IsType<NotFoundResult>(result);
		}

		[Fact]
		public async Task DeletePost_ReturnsBadRequestObjectResult_WhenResultIsFailure()
		{
			// Arrange
			var postId = Guid.NewGuid();
			var failureResult = Result<Unit>.Failure("Error deleting post");
			_mediatorMock
				.Setup(m => m.Send(
					It.Is<Delete.Command>(cmd => cmd.Id == postId),
					It.IsAny<CancellationToken>()))
				.ReturnsAsync(failureResult);

			// Act
			var result = await _controller.DeletePost(postId);

			// Assert
			var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
			Assert.Equal("Error deleting post", badRequestResult.Value);
		}

		#endregion
	}
}