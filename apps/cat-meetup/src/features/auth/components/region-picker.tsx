import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { type RegionCode, regionOptions } from "../types";

type RegionPickerProps = {
  error?: string;
  label?: string;
  onChange: (value: RegionCode) => void;
  value: RegionCode;
};

export function RegionPicker({
  error,
  label = "사는 지역(구 단위)",
  onChange,
  value,
}: RegionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = useMemo(
    () => regionOptions.find((option) => option.code === value)?.label ?? value,
    [value],
  );

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>
        {label}
      </Text>

      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        style={({ pressed }) => ({
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "#e2e8f0",
          borderRadius: 12,
          padding: 14,
          backgroundColor: "#f8fafc",
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ color: "#0f172a", fontSize: 16 }}>{selectedLabel}</Text>
        <Text style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>
          {isOpen ? "지역 목록 닫기" : "눌러서 지역 선택"}
        </Text>
      </Pressable>

      {isOpen ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e2e8f0",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          {regionOptions.map((option, index) => {
            const isSelected = option.code === value;

            return (
              <Pressable
                key={option.code}
                onPress={() => {
                  onChange(option.code);
                  setIsOpen(false);
                }}
                style={({ pressed }) => {
                  let backgroundColor = "white";

                  if (isSelected) {
                    backgroundColor = "#eef2ff";
                  } else if (pressed) {
                    backgroundColor = "#f8fafc";
                  }

                  return {
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    backgroundColor,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: "#f1f5f9",
                  };
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#4338ca" : "#0f172a",
                    fontWeight: isSelected ? "700" : "500",
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {error ? (
        <Text style={{ fontSize: 13, color: "#ef4444" }}>{error}</Text>
      ) : null}
    </View>
  );
}
