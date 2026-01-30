import { account } from "./appwrite";

export const login = async (email: string, password: string) => {
  console.log("Attempting login for:", email);
  console.log("Password provided:", password ? "Yes" : "No");
  return await account.createEmailPasswordSession(email, password);
};

export const logout = async () => {
  return await account.deleteSession("current");
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  return await account.updatePassword(newPassword, oldPassword);
};
