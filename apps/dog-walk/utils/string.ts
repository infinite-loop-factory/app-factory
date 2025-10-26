export const maskName = (name: string): string => {
  if (!name) return "";

  // NOTE: 한글 이름인 경우
  if (/^[가-힣]+$/.test(name)) {
    if (name.length === 2) return `${name[0]}*`;
    if (name.length >= 3)
      return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    return "*";
  }

  // NOTE: 영어 이름인 경우
  if (/^[a-zA-Z\s]+$/.test(name)) {
    const parts = name.split(" ").filter(Boolean);
    return parts
      .map((p) =>
        p.length <= 2
          ? `${p[0]}*`
          : p[0] + "*".repeat(p.length - 2) + p[p.length - 1],
      )
      .join(" ");
  }

  // NOTE: 그 외의 경우
  return name[0] + "*".repeat(Math.max(1, name.length - 1));
};
