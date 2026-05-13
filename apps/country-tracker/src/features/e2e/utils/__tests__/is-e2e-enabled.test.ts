import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.mock("@/constants/env", () => ({ env: {} }));

import { env } from "@/constants/env";
import { isE2EEnabled } from "@/features/e2e/utils/is-e2e-enabled";

const devGlobal = globalThis as unknown as { __DEV__: boolean };

describe("isE2EEnabled", () => {
  const originalDev = devGlobal.__DEV__;
  const mutableEnv = env as { EXPO_PUBLIC_E2E_MODE?: string };

  beforeEach(() => {
    mutableEnv.EXPO_PUBLIC_E2E_MODE = undefined;
  });

  afterEach(() => {
    devGlobal.__DEV__ = originalDev;
    mutableEnv.EXPO_PUBLIC_E2E_MODE = undefined;
  });

  it("프로덕션(__DEV__=false) + flag='true' → false (defense-in-depth)", () => {
    devGlobal.__DEV__ = false;
    mutableEnv.EXPO_PUBLIC_E2E_MODE = "true";

    expect(isE2EEnabled()).toBe(false);
  });

  it("프로덕션(__DEV__=false) + flag undefined → false", () => {
    devGlobal.__DEV__ = false;

    expect(isE2EEnabled()).toBe(false);
  });

  it("dev(__DEV__=true) + flag undefined → false", () => {
    devGlobal.__DEV__ = true;

    expect(isE2EEnabled()).toBe(false);
  });

  it("dev(__DEV__=true) + flag='false' → false", () => {
    devGlobal.__DEV__ = true;
    mutableEnv.EXPO_PUBLIC_E2E_MODE = "false";

    expect(isE2EEnabled()).toBe(false);
  });

  it("dev(__DEV__=true) + flag='true' → true (유일한 활성 경로)", () => {
    devGlobal.__DEV__ = true;
    mutableEnv.EXPO_PUBLIC_E2E_MODE = "true";

    expect(isE2EEnabled()).toBe(true);
  });
});
