import { userAtom } from "@/atoms/userAtom";
import AuthRequiredView from "@/components/AuthRequiredView";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import HeaderBar from "@/components/HeaderBar";
import ProfileView from "@/components/ProfileView";
import { useAtomValue } from "jotai/react";

export default function ProfileScreen() {
  const userInfo = useAtomValue(userAtom);
  const isLoggedIn = Boolean(userInfo.accessToken);

  return (
    <CustomSafeAreaView>
      <HeaderBar title={"프로필"} />
      {!isLoggedIn && <AuthRequiredView />}
      {isLoggedIn && <ProfileView />}
    </CustomSafeAreaView>
  );
}
