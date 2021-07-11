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

const buildLoadingResult = (): ResultLoading => ({
  type: 'loading',
});

const buildSuccessResult = <T,>(value: T): ResultSuccess<T> => ({
  type: 'success',
  value,
});

const buildErrorResult = <E,>(error: E): ResultError<E> => ({
  type: 'error',
  error,
});

export { buildLoadingResult, buildSuccessResult, buildErrorResult };
export type { Result, ResultLoading, ResultSuccess, ResultError };
