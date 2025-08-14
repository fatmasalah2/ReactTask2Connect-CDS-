import type { JwtToken } from "./token";

type request = {
  username: string;
  password: string;
};

export function login(req: request): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    if (req.username === "admin" && req.password === "password") {
      const token: JwtToken = {
        token: "jwt-token",
        expiresIn: 65,
        refreshToken: "refresh-token",
        refreshExpiresIn: 7200,
      };
      resolve(token);
    } else {
      reject(new Error("Invalid username or password"));
    }
  });
}
