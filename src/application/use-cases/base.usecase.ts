export abstract class UseCaseBase<IRequest, IResponse> {
  abstract execute(request: IRequest): Promise<IResponse>;

  protected ensureDefined<T>(value: T | null | undefined, message: string): T {
    if (value === null || value === undefined) {
      throw new Error(message);
    }
    return value;
  }

  protected ensureCondition(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(message);
    }
  }
}
