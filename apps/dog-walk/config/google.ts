import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const configureGoogleSignin = () => {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_WEB_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_IOS_ID,
  });
};
