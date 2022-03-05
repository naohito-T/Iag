export interface IRequestServiceAPI {
  postLine(texts: string[]): Promise<void>;
}
