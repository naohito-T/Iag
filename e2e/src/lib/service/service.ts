export interface IRequestServiceAPI {
  postTeams(texts: string[]): Promise<void>;
}
