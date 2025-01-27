import AuthRequiredView from "@/components/AuthRequiredView";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import HeaderBar from "@/components/HeaderBar";
import ProfileView from "@/components/ProfileView";
import { useState } from "react";

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <CustomSafeAreaView>
      <HeaderBar title={"프로필"} />
      {!isLoggedIn && <AuthRequiredView setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && <ProfileView />}
    </CustomSafeAreaView>
  );
}
