"use client";

import { vars } from "nativewind";

export const config = {
  light: vars({
    /* Primary - 블루그레이 톤 */
    "--color-primary-0": "255 255 255", // #ffffff
    "--color-primary-50": "248 250 252", // #f8fafc
    "--color-primary-100": "241 245 249", // #f1f5f9
    "--color-primary-200": "226 232 240", // #e2e8f0
    "--color-primary-300": "203 213 225", // #cbd5e1
    "--color-primary-400": "148 163 184", // #94a3b8
    "--color-primary-500": "100 116 139", // #64748b
    "--color-primary-600": "71 85 105", // #475569
    "--color-primary-700": "51 65 85", // #334155
    "--color-primary-800": "30 41 59", // #1e293b
    "--color-primary-900": "15 23 42", // #0f172a
    "--color-primary-950": "2 6 23", // #020617

    /* Secondary - 중성 그레이 */
    "--color-secondary-0": "255 255 255", // #ffffff
    "--color-secondary-50": "249 250 251", // #f9fafb
    "--color-secondary-100": "243 244 246", // #f3f4f6
    "--color-secondary-200": "229 231 235", // #e5e7eb
    "--color-secondary-300": "209 213 219", // #d1d5db
    "--color-secondary-400": "156 163 175", // #9ca3af
    "--color-secondary-500": "107 114 128", // #6b7280
    "--color-secondary-600": "75 85 99", // #4b5563
    "--color-secondary-700": "55 65 81", // #374151
    "--color-secondary-800": "31 41 55", // #1f2937
    "--color-secondary-900": "17 24 39", // #111827
    "--color-secondary-950": "3 7 18", // #030712

    /* Tertiary - 진정한 그레이 */
    "--color-tertiary-0": "255 255 255", // #ffffff
    "--color-tertiary-50": "250 250 250", // #fafafa
    "--color-tertiary-100": "244 244 245", // #f4f4f5
    "--color-tertiary-200": "228 228 231", // #e4e4e7
    "--color-tertiary-300": "212 212 216", // #d4d4d8
    "--color-tertiary-400": "161 161 170", // #a1a1aa
    "--color-tertiary-500": "113 113 122", // #71717a
    "--color-tertiary-600": "82 82 91", // #52525b
    "--color-tertiary-700": "63 63 70", // #3f3f46
    "--color-tertiary-800": "39 39 42", // #27272a
    "--color-tertiary-900": "24 24 27", // #18181b
    "--color-tertiary-950": "9 9 11", // #09090b

    /* Error - 무채색 (진한 그레이) */
    "--color-error-0": "255 255 255", // #ffffff
    "--color-error-50": "250 250 250", // #fafafa
    "--color-error-100": "244 244 245", // #f4f4f5
    "--color-error-200": "228 228 231", // #e4e4e7
    "--color-error-300": "212 212 216", // #d4d4d8
    "--color-error-400": "161 161 170", // #a1a1aa
    "--color-error-500": "113 113 122", // #71717a
    "--color-error-600": "82 82 91", // #52525b
    "--color-error-700": "63 63 70", // #3f3f46
    "--color-error-800": "39 39 42", // #27272a
    "--color-error-900": "24 24 27", // #18181b
    "--color-error-950": "9 9 11", // #09090b

    /* Success - 무채색 (밝은 그레이) */
    "--color-success-0": "255 255 255", // #ffffff
    "--color-success-50": "249 250 251", // #f9fafb
    "--color-success-100": "243 244 246", // #f3f4f6
    "--color-success-200": "229 231 235", // #e5e7eb
    "--color-success-300": "209 213 219", // #d1d5db
    "--color-success-400": "156 163 175", // #9ca3af
    "--color-success-500": "107 114 128", // #6b7280
    "--color-success-600": "75 85 99", // #4b5563
    "--color-success-700": "55 65 81", // #374151
    "--color-success-800": "31 41 55", // #1f2937
    "--color-success-900": "17 24 39", // #111827
    "--color-success-950": "3 7 18", // #030712

    /* Warning - 무채색 (블루그레이) */
    "--color-warning-0": "255 255 255", // #ffffff
    "--color-warning-50": "248 250 252", // #f8fafc
    "--color-warning-100": "241 245 249", // #f1f5f9
    "--color-warning-200": "226 232 240", // #e2e8f0
    "--color-warning-300": "203 213 225", // #cbd5e1
    "--color-warning-400": "148 163 184", // #94a3b8
    "--color-warning-500": "100 116 139", // #64748b
    "--color-warning-600": "71 85 105", // #475569
    "--color-warning-700": "51 65 85", // #334155
    "--color-warning-800": "30 41 59", // #1e293b
    "--color-warning-900": "15 23 42", // #0f172a
    "--color-warning-950": "2 6 23", // #020617

    /* Info - 무채색 (진정한 그레이) */
    "--color-info-0": "255 255 255", // #ffffff
    "--color-info-50": "250 250 250", // #fafafa
    "--color-info-100": "244 244 245", // #f4f4f5
    "--color-info-200": "228 228 231", // #e4e4e7
    "--color-info-300": "212 212 216", // #d4d4d8
    "--color-info-400": "161 161 170", // #a1a1aa
    "--color-info-500": "113 113 122", // #71717a
    "--color-info-600": "82 82 91", // #52525b
    "--color-info-700": "63 63 70", // #3f3f46
    "--color-info-800": "39 39 42", // #27272a
    "--color-info-900": "24 24 27", // #18181b
    "--color-info-950": "9 9 11", // #09090b

    /* Typography - 고대비 텍스트 */
    "--color-typography-0": "255 255 255", // #ffffff
    "--color-typography-50": "250 250 250", // #fafafa
    "--color-typography-100": "244 244 245", // #f4f4f5
    "--color-typography-200": "228 228 231", // #e4e4e7
    "--color-typography-300": "212 212 216", // #d4d4d8
    "--color-typography-400": "161 161 170", // #a1a1aa
    "--color-typography-500": "113 113 122", // #71717a
    "--color-typography-600": "82 82 91", // #52525b
    "--color-typography-700": "63 63 70", // #3f3f46
    "--color-typography-800": "39 39 42", // #27272a
    "--color-typography-900": "24 24 27", // #18181b
    "--color-typography-950": "9 9 11", // #09090b

    /* Outline - 테두리 */
    "--color-outline-0": "255 255 255", // #ffffff
    "--color-outline-50": "249 250 251", // #f9fafb
    "--color-outline-100": "243 244 246", // #f3f4f6
    "--color-outline-200": "229 231 235", // #e5e7eb
    "--color-outline-300": "209 213 219", // #d1d5db
    "--color-outline-400": "156 163 175", // #9ca3af
    "--color-outline-500": "107 114 128", // #6b7280
    "--color-outline-600": "75 85 99", // #4b5563
    "--color-outline-700": "55 65 81", // #374151
    "--color-outline-800": "31 41 55", // #1f2937
    "--color-outline-900": "17 24 39", // #111827
    "--color-outline-950": "3 7 18", // #030712

    /* Background - 배경 */
    "--color-background-0": "255 255 255", // #ffffff
    "--color-background-50": "250 250 250", // #fafafa
    "--color-background-100": "244 244 245", // #f4f4f5
    "--color-background-200": "228 228 231", // #e4e4e7
    "--color-background-300": "212 212 216", // #d4d4d8
    "--color-background-400": "161 161 170", // #a1a1aa
    "--color-background-500": "113 113 122", // #71717a
    "--color-background-600": "82 82 91", // #52525b
    "--color-background-700": "63 63 70", // #3f3f46
    "--color-background-800": "39 39 42", // #27272a
    "--color-background-900": "24 24 27", // #18181b
    "--color-background-950": "9 9 11", // #09090b

    /* Background Special - 상태별 배경 */
    "--color-background-error": "244 244 245", // #f4f4f5
    "--color-background-warning": "249 250 251", // #f9fafb
    "--color-background-success": "249 250 251", // #f9fafb
    "--color-background-muted": "244 244 245", // #f4f4f5
    "--color-background-info": "248 250 252", // #f8fafc

    /* Indicator - 포커스 링 */
    "--color-indicator-primary": "82 82 91", // #52525b
    "--color-indicator-info": "113 113 122", // #71717a
    "--color-indicator-error": "39 39 42", // #27272a
  }),

  dark: vars({
    /* Primary - 다크 모드에서는 밝은 그레이 */
    "--color-primary-0": "2 6 23", // #020617
    "--color-primary-50": "15 23 42", // #0f172a
    "--color-primary-100": "30 41 59", // #1e293b
    "--color-primary-200": "51 65 85", // #334155
    "--color-primary-300": "71 85 105", // #475569
    "--color-primary-400": "100 116 139", // #64748b
    "--color-primary-500": "148 163 184", // #94a3b8
    "--color-primary-600": "203 213 225", // #cbd5e1
    "--color-primary-700": "226 232 240", // #e2e8f0
    "--color-primary-800": "241 245 249", // #f1f5f9
    "--color-primary-900": "248 250 252", // #f8fafc
    "--color-primary-950": "255 255 255", // #ffffff

    /* Secondary - 다크 모드 중성 그레이 */
    "--color-secondary-0": "3 7 18", // #030712
    "--color-secondary-50": "17 24 39", // #111827
    "--color-secondary-100": "31 41 55", // #1f2937
    "--color-secondary-200": "55 65 81", // #374151
    "--color-secondary-300": "75 85 99", // #4b5563
    "--color-secondary-400": "107 114 128", // #6b7280
    "--color-secondary-500": "156 163 175", // #9ca3af
    "--color-secondary-600": "209 213 219", // #d1d5db
    "--color-secondary-700": "229 231 235", // #e5e7eb
    "--color-secondary-800": "243 244 246", // #f3f4f6
    "--color-secondary-900": "249 250 251", // #f9fafb
    "--color-secondary-950": "255 255 255", // #ffffff

    /* Tertiary - 다크 모드 진정한 그레이 */
    "--color-tertiary-0": "9 9 11", // #09090b
    "--color-tertiary-50": "24 24 27", // #18181b
    "--color-tertiary-100": "39 39 42", // #27272a
    "--color-tertiary-200": "63 63 70", // #3f3f46
    "--color-tertiary-300": "82 82 91", // #52525b
    "--color-tertiary-400": "113 113 122", // #71717a
    "--color-tertiary-500": "161 161 170", // #a1a1aa
    "--color-tertiary-600": "212 212 216", // #d4d4d8
    "--color-tertiary-700": "228 228 231", // #e4e4e7
    "--color-tertiary-800": "244 244 245", // #f4f4f5
    "--color-tertiary-900": "250 250 250", // #fafafa
    "--color-tertiary-950": "255 255 255", // #ffffff

    /* Error - 다크 모드 무채색 */
    "--color-error-0": "9 9 11", // #09090b
    "--color-error-50": "24 24 27", // #18181b
    "--color-error-100": "39 39 42", // #27272a
    "--color-error-200": "63 63 70", // #3f3f46
    "--color-error-300": "82 82 91", // #52525b
    "--color-error-400": "113 113 122", // #71717a
    "--color-error-500": "161 161 170", // #a1a1aa
    "--color-error-600": "212 212 216", // #d4d4d8
    "--color-error-700": "228 228 231", // #e4e4e7
    "--color-error-800": "244 244 245", // #f4f4f5
    "--color-error-900": "250 250 250", // #fafafa
    "--color-error-950": "255 255 255", // #ffffff

    /* Success - 다크 모드 무채색 */
    "--color-success-0": "3 7 18", // #030712
    "--color-success-50": "17 24 39", // #111827
    "--color-success-100": "31 41 55", // #1f2937
    "--color-success-200": "55 65 81", // #374151
    "--color-success-300": "75 85 99", // #4b5563
    "--color-success-400": "107 114 128", // #6b7280
    "--color-success-500": "156 163 175", // #9ca3af
    "--color-success-600": "209 213 219", // #d1d5db
    "--color-success-700": "229 231 235", // #e5e7eb
    "--color-success-800": "243 244 246", // #f3f4f6
    "--color-success-900": "249 250 251", // #f9fafb
    "--color-success-950": "255 255 255", // #ffffff

    /* Warning - 다크 모드 무채색 */
    "--color-warning-0": "2 6 23", // #020617
    "--color-warning-50": "15 23 42", // #0f172a
    "--color-warning-100": "30 41 59", // #1e293b
    "--color-warning-200": "51 65 85", // #334155
    "--color-warning-300": "71 85 105", // #475569
    "--color-warning-400": "100 116 139", // #64748b
    "--color-warning-500": "148 163 184", // #94a3b8
    "--color-warning-600": "203 213 225", // #cbd5e1
    "--color-warning-700": "226 232 240", // #e2e8f0
    "--color-warning-800": "241 245 249", // #f1f5f9
    "--color-warning-900": "248 250 252", // #f8fafc
    "--color-warning-950": "255 255 255", // #ffffff

    /* Info - 다크 모드 무채색 */
    "--color-info-0": "9 9 11", // #09090b
    "--color-info-50": "24 24 27", // #18181b
    "--color-info-100": "39 39 42", // #27272a
    "--color-info-200": "63 63 70", // #3f3f46
    "--color-info-300": "82 82 91", // #52525b
    "--color-info-400": "113 113 122", // #71717a
    "--color-info-500": "161 161 170", // #a1a1aa
    "--color-info-600": "212 212 216", // #d4d4d8
    "--color-info-700": "228 228 231", // #e4e4e7
    "--color-info-800": "244 244 245", // #f4f4f5
    "--color-info-900": "250 250 250", // #fafafa
    "--color-info-950": "255 255 255", // #ffffff

    /* Typography - 다크 모드 고대비 텍스트 */
    "--color-typography-0": "255 255 255", // #ffffff
    "--color-typography-50": "250 250 250", // #fafafa
    "--color-typography-100": "244 244 245", // #f4f4f5
    "--color-typography-200": "228 228 231", // #e4e4e7
    "--color-typography-300": "212 212 216", // #d4d4d8
    "--color-typography-400": "161 161 170", // #a1a1aa
    "--color-typography-500": "113 113 122", // #71717a
    "--color-typography-600": "82 82 91", // #52525b
    "--color-typography-700": "63 63 70", // #3f3f46
    "--color-typography-800": "39 39 42", // #27272a
    "--color-typography-900": "24 24 27", // #18181b
    "--color-typography-950": "9 9 11", // #09090b

    /* Outline - 다크 모드 테두리 */
    "--color-outline-0": "3 7 18", // #030712
    "--color-outline-50": "17 24 39", // #111827
    "--color-outline-100": "31 41 55", // #1f2937
    "--color-outline-200": "55 65 81", // #374151
    "--color-outline-300": "75 85 99", // #4b5563
    "--color-outline-400": "107 114 128", // #6b7280
    "--color-outline-500": "156 163 175", // #9ca3af
    "--color-outline-600": "209 213 219", // #d1d5db
    "--color-outline-700": "229 231 235", // #e5e7eb
    "--color-outline-800": "243 244 246", // #f3f4f6
    "--color-outline-900": "249 250 251", // #f9fafb
    "--color-outline-950": "255 255 255", // #ffffff

    /* Background - 다크 모드 배경 */
    "--color-background-0": "9 9 11", // #09090b
    "--color-background-50": "24 24 27", // #18181b
    "--color-background-100": "39 39 42", // #27272a
    "--color-background-200": "63 63 70", // #3f3f46
    "--color-background-300": "82 82 91", // #52525b
    "--color-background-400": "113 113 122", // #71717a
    "--color-background-500": "161 161 170", // #a1a1aa
    "--color-background-600": "212 212 216", // #d4d4d8
    "--color-background-700": "228 228 231", // #e4e4e7
    "--color-background-800": "244 244 245", // #f4f4f5
    "--color-background-900": "250 250 250", // #fafafa
    "--color-background-950": "255 255 255", // #ffffff

    /* Background Special - 다크 모드 상태별 배경 */
    "--color-background-error": "39 39 42", // #27272a
    "--color-background-warning": "24 24 27", // #18181b
    "--color-background-success": "31 41 55", // #1f2937
    "--color-background-muted": "39 39 42", // #27272a
    "--color-background-info": "30 41 59", // #1e293b

    /* Indicator - 다크 모드 포커스 링 */
    "--color-indicator-primary": "161 161 170", // #a1a1aa
    "--color-indicator-info": "113 113 122", // #71717a
    "--color-indicator-error": "212 212 216", // #d4d4d8
  }),
};
