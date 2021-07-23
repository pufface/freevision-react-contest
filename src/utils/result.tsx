type ResultSuccess<T> = {
  type: 'success';
  value: T;
};

type ResultError<E> = {
  type: 'error';
  error: E;
};

type ResultLoading = {
  type: 'loading';
};

type Result<T, E> = ResultLoading | ResultSuccess<T> | ResultError<E>;

const LoadingResult = (): ResultLoading => ({
  type: 'loading',
});

const SuccessResult = <T,>(value: T): ResultSuccess<T> => ({
  type: 'success',
  value,
});

const ErrorResult = <E,>(error: E): ResultError<E> => ({
  type: 'error',
  error,
});

export { LoadingResult, SuccessResult, ErrorResult };
export type { Result, ResultLoading, ResultSuccess, ResultError };
