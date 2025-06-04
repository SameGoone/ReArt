using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Core
{
	public class Result<T>
	{
		public bool IsSuccess { get; set; }
		public T Value { get; set; }
		public string Error { get; set; }

		public static Result<T> Success(T value)
			=> new Result<T> { IsSuccess = true, Value = value };

		public static Result<T> Failure(string error)
			=> new Result<T> { IsSuccess = false, Error = error };

		public static Result<T> Copy<TSource>(Result<TSource> source)
			=> new Result<T> { IsSuccess = source.IsSuccess, Error = source.Error };
	}
}
