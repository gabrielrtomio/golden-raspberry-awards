export interface UseCase<P, R = void> {
  execute(params: P): Promise<R>;
}
