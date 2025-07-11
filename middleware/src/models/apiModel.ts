export interface UserInterface {
  firstName: string;
  lastName: string;
  id: number;
  profilePhoto: string | null;
  email: string;
  username: string;
  createdAt: string;
}

export interface UserResponse {
    email : string,
    firstName : string,
    lastName : string
}