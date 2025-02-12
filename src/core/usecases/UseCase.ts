export interface UseCase<T> {
  execute(params: T): Promise<void>;
}
