export const trimUserData = (userData) => {
  return {
    email: userData.email.trim(),
    password: userData.password.trim(),
    profile_picture: userData.profile_picture || "",
    wallet_address: userData.wallet_address.trim(),
  };
};
