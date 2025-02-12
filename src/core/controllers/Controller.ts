export interface Controller<Req = any, Res = any> {
  handle(req: Req): Promise<Res>;
}
