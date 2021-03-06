export interface IPayload {
  readonly username: string;
  readonly sub: number;
}

export interface IAuthResponse {
  access_token: string;
}

export class AuthResponse implements IAuthResponse {
  access_token: string;
}