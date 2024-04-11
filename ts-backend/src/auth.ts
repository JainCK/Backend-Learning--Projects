import bcrypt from "bcrypt";

export const hashPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePass = async (
  plainPass: string,
  hashedPass: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPass, hashedPass);
};
