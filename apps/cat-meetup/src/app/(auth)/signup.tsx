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
import { signUpWithPhoneProfile } from "@/features/auth/api/sign-up";
import { RegionPicker } from "@/features/auth/components/region-picker";
import {
  emptySignupFieldErrors,
  genderOptions,
  initialSignupFormValues,
  type SignupFormValues,
} from "@/features/auth/types";
import { validateSignUpForm } from "@/features/auth/validators/sign-up";

const BRAND_COLOR = "#6366f1";
const BRAND_LIGHT = "#eef2ff";

function LabeledInput(props: {
  autoComplete?:
    | "birthdate-full"
    | "email"
    | "name"
    | "password"
    | "tel"
    | "username";
  error?: string;
  inputMode?: "email" | "numeric" | "tel" | "text";
  keyboardType?:
    | "default"
    | "email-address"
    | "number-pad"
    | "phone-pad"
    | "twitter";
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>
        {props.label}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={props.secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: props.error ? "#ef4444" : "#e2e8f0",
          borderRadius: 12,
          padding: 14,
          fontSize: 16,
          color: "#0f172a",
          backgroundColor: "#f8fafc",
          minHeight: props.multiline ? 120 : undefined,
          textAlignVertical: props.multiline ? "top" : "auto",
        }}
        value={props.value}
      />
      {props.error ? (
        <Text style={{ fontSize: 13, color: "#ef4444" }}>{props.error}</Text>
      ) : null}
    </View>
  );
}

function SelectChip(props: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => ({
        backgroundColor: props.isSelected ? BRAND_COLOR : "#eef2ff",
        borderColor: props.isSelected ? BRAND_COLOR : "#cbd5e1",
        borderRadius: 999,
        borderWidth: 1,
        opacity: pressed ? 0.8 : 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
      })}
    >
      <Text
        style={{
          color: props.isSelected ? "white" : "#334155",
          fontWeight: "600",
        }}
      >
        {props.label}
      </Text>
    </Pressable>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState<SignupFormValues>(initialSignupFormValues);
  const [errors, setErrors] = useState(emptySignupFieldErrors);
  const [loading, setLoading] = useState(false);

  const updateField = <Key extends keyof SignupFormValues>(
    field: Key,
    value: SignupFormValues[Key],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    const validation = validateSignUpForm(form);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    setLoading(true);
    try {
      await signUpWithPhoneProfile(form);

      Alert.alert(
        "회원가입 완료",
        "회원가입이 완료되었습니다. 이제 고양이 카드를 등록해볼까요?",
        [
          {
            text: "확인",
            onPress: () => router.replace("/(cat)/register"),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다. 다시 시도해주세요.";
      Alert.alert("회원가입 실패", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 18 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: BRAND_LIGHT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 36 }}>🐾</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>
            사람 회원가입
          </Text>
          <Text style={{ fontSize: 15, color: "#64748b", textAlign: "center" }}>
            Supabase Auth 가입 후 사용자 정보를 `users` 테이블에 저장합니다.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            padding: 20,
            gap: 16,
          }}
        >
          <LabeledInput
            autoComplete="name"
            error={errors.name}
            label="이름"
            onChangeText={(value) => updateField("name", value)}
            placeholder="홍길동"
            value={form.name}
          />

          <LabeledInput
            autoComplete="tel"
            error={errors.phone}
            inputMode="tel"
            keyboardType="phone-pad"
            label="핸드폰번호(로그인 ID)"
            onChangeText={(value) => updateField("phone", value)}
            placeholder="01012345678"
            value={form.phone}
          />

          <LabeledInput
            autoComplete="username"
            error={errors.kakaoId}
            label="카카오톡 아이디"
            onChangeText={(value) => updateField("kakaoId", value)}
            placeholder="catlover123"
            value={form.kakaoId}
          />

          <LabeledInput
            autoComplete="email"
            error={errors.email}
            inputMode="email"
            keyboardType="email-address"
            label="이메일"
            onChangeText={(value) => updateField("email", value)}
            placeholder="hello@example.com"
            value={form.email}
          />

          <LabeledInput
            autoComplete="password"
            error={errors.password}
            label="비밀번호"
            onChangeText={(value) => updateField("password", value)}
            placeholder="영문 + 숫자 포함 8자 이상"
            secureTextEntry
            value={form.password}
          />

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>
              성별
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {genderOptions.map((option) => (
                <SelectChip
                  isSelected={form.gender === option}
                  key={option}
                  label={option}
                  onPress={() => updateField("gender", option)}
                />
              ))}
            </View>
          </View>

          <LabeledInput
            autoComplete="birthdate-full"
            error={errors.birthDate}
            label="생년월일"
            onChangeText={(value) => updateField("birthDate", value)}
            placeholder="1998-03-21"
            value={form.birthDate}
          />

          <RegionPicker
            error={errors.regionCode}
            onChange={(value) => updateField("regionCode", value)}
            value={form.regionCode}
          />

          <LabeledInput
            error={errors.bio}
            label="본인 설명 / 자기소개"
            multiline
            onChangeText={(value) => updateField("bio", value)}
            placeholder="고양이를 좋아하게 된 계기나 돌봄 경험을 적어주세요."
            value={form.bio}
          />

          <Pressable
            disabled={loading}
            onPress={handleSubmit}
            style={({ pressed }) => {
              let backgroundColor = BRAND_COLOR;

              if (loading) {
                backgroundColor = "#c7d2fe";
              } else if (pressed) {
                backgroundColor = "#4f46e5";
              }

              return {
                backgroundColor,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                marginTop: 4,
              };
            }}
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : null}
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              {loading ? "가입 처리 중..." : "회원가입 완료"}
            </Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", gap: 6, marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: "#64748b" }}>
            이미 계정이 있으신가요?
          </Text>
          <Link
            href="/(auth)/login"
            style={{ color: BRAND_COLOR, fontWeight: "700", fontSize: 14 }}
          >
            로그인으로 이동
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
