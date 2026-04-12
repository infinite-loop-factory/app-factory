import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { signInWithPhonePassword } from "@/features/auth/api/sign-in";

type LoginForm = {
  phone: string;
  password: string;
};

type FormErrors = {
  phone: string;
  password: string;
};

const BRAND_COLOR = "#6366f1";
const BRAND_LIGHT = "#eef2ff";

export default function LoginScreen() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = { phone: "", password: "" };
    let valid = true;

    const phoneDigits = form.phone.replace(/[^0-9]/g, "");
    if (!phoneDigits) {
      next.phone = "핸드폰번호를 입력해주세요";
      valid = false;
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      next.phone = "올바른 핸드폰번호를 입력해주세요";
      valid = false;
    }

    if (!form.password) {
      next.password = "비밀번호를 입력해주세요";
      valid = false;
    } else if (form.password.length < 6) {
      next.password = "비밀번호는 6자 이상이어야 합니다";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signInWithPhonePassword(form);

      // 로그인 성공 시 메인 화면으로 이동
      router.replace("/(posts)/list");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 다시 시도해주세요.";

      if (
        message.includes("핸드폰번호") ||
        message.includes("비밀번호가 올바르지")
      ) {
        setErrors({
          phone: "",
          password: message,
        });
      } else {
        Alert.alert("로그인 실패", message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = form.phone.length > 0 && form.password.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View style={{ alignItems: "center", gap: 8, marginBottom: 40 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: BRAND_LIGHT,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 36 }}>🐱</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>
            냥냥모임
          </Text>
          <Text style={{ fontSize: 15, color: "#64748b", textAlign: "center" }}>
            고양이 돌봄 · 친구찾기 · 물품나눔
          </Text>
        </View>

        {/* 로그인 폼 */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            gap: 16,
            borderCurve: "continuous",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* 핸드폰번호 */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>
              핸드폰번호
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="tel"
              editable={!loading}
              inputMode="tel"
              onChangeText={(v) => updateField("phone", v)}
              placeholder="01012345678"
              placeholderTextColor="#94a3b8"
              style={{
                borderWidth: 1,
                borderColor: errors.phone ? "#ef4444" : "#e2e8f0",
                borderRadius: 12,
                padding: 14,
                fontSize: 16,
                color: "#0f172a",
                backgroundColor: "#f8fafc",
                borderCurve: "continuous",
              }}
              value={form.phone}
            />
            {errors.phone ? (
              <Text style={{ fontSize: 13, color: "#ef4444" }}>
                {errors.phone}
              </Text>
            ) : null}
          </View>

          {/* 비밀번호 */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>
              비밀번호
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
              onChangeText={(v) => updateField("password", v)}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: errors.password ? "#ef4444" : "#e2e8f0",
                borderRadius: 12,
                padding: 14,
                fontSize: 16,
                color: "#0f172a",
                backgroundColor: "#f8fafc",
                borderCurve: "continuous",
              }}
              value={form.password}
            />
            {errors.password ? (
              <Text style={{ fontSize: 13, color: "#ef4444" }}>
                {errors.password}
              </Text>
            ) : null}
          </View>

          {/* 로그인 버튼 */}
          <Pressable
            disabled={loading || !isFormFilled}
            onPress={handleLogin}
            style={({ pressed }) => ({
              backgroundColor:
                loading || !isFormFilled ? "#c7d2fe" : getButtonColor(pressed),
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
              borderCurve: "continuous",
              marginTop: 4,
            })}
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : null}
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              {loading ? "로그인 중..." : "로그인"}
            </Text>
          </Pressable>
        </View>

        {/* 하단 링크 */}
        <View
          style={{
            alignItems: "center",
            gap: 16,
            marginTop: 28,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 14, color: "#64748b" }}>
              아직 계정이 없으신가요?
            </Text>
            <Link
              href="/(auth)/signup"
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: BRAND_COLOR,
              }}
            >
              회원가입
            </Link>
          </View>

          <Pressable
            onPress={() => router.replace("/(posts)/list")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textDecorationLine: "underline",
              }}
            >
              둘러보기
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
