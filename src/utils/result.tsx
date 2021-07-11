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

const resultFactory = {
  loading: (): ResultLoading => ({
    type: 'loading',
  }),
  success: <T,>(value: T): ResultSuccess<T> => ({
    type: 'success',
    value,
  }),
  error: <E,>(error: E): ResultError<E> => ({
    type: 'error',
    error,
  }),
};

export default resultFactory;
export type { Result, ResultLoading, ResultSuccess, ResultError };
