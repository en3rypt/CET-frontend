import { LocalStorageEnum } from "@/constants/enum";
import { jwtDecode, JwtPayload } from "jwt-decode";

export function isAuthenticated(): boolean {
  try {
    const authToken: string | null = localStorage.getItem(
      LocalStorageEnum.AUTH_TOKEN
    );
    if (authToken) {
      const jwtInfo = jwtDecode<JwtPayload>(authToken);
      if (jwtInfo.exp && Date.now() >= jwtInfo.exp * 1000) {
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
