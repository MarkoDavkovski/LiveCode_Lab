export interface RegisterUserDTO {
  username: string;
  password: string;
}

export interface LoginUserDTO {
  username: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  message: string;
}
