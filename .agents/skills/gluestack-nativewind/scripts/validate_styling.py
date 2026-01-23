#!/usr/bin/env python3
# This file is managed by Lisa.
# Do not edit directly — changes will be overwritten on the next `lisa` run.
"""
Validates Gluestack UI v3 and NativeWind v4 styling patterns.

This script detects common styling violations:
1. Direct React Native imports with Gluestack equivalents
2. Raw color values without semantic tokens
3. Inline style objects where className could be used
4. Arbitrary bracket notation values
5. Non-scale spacing values

Usage:
    python3 validate_styling.py [path]

Arguments:
    path    Optional path to validate. Defaults to current directory.
            Can be a file or directory.
"""

import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class Violation:
    """Represents a styling violation."""
    file: str
    line: int
    rule: str
    message: str
    severity: str = "error"


# React Native components that have Gluestack equivalents
RN_TO_GLUESTACK_MAP = {
    "View": "Box",
    "Text": "Text (from @/components/ui/text)",
    "TouchableOpacity": "Pressable",
    "TouchableHighlight": "Pressable",
    "TouchableWithoutFeedback": "Pressable",
    "Image": "Image (from @/components/ui/image)",
    "ScrollView": "ScrollView (from @/components/ui/scroll-view)",
    "TextInput": "Input + InputField",
    "FlatList": "FlashList",
    "SectionList": "FlashList",
    "ActivityIndicator": "Spinner",
    "Modal": "Modal (from @/components/ui/modal)",
}

# Raw colors that should be semantic tokens
RAW_COLOR_PATTERNS = [
    # Tailwind raw colors (red, green, blue, yellow, gray, etc.)
    r'\b(text|bg|border|ring|fill|stroke)-(red|green|blue|yellow|orange|purple|pink|indigo|cyan|teal|emerald|lime|amber|violet|fuchsia|rose|sky|slate|gray|zinc|neutral|stone)-\d{2,3}\b',
    # White/black that should be typography-0 or typography-950
    r'\btext-white\b',
    r'\btext-black\b',
    r'\bbg-white\b',
    r'\bbg-black\b',
]

# Semantic tokens that ARE allowed
ALLOWED_SEMANTIC_PATTERNS = [
    r'\b(text|bg|border|ring)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-',
]

# Arbitrary value patterns (bracket notation)
ARBITRARY_VALUE_PATTERNS = [
    r'\b[a-z]+-\[\d+px\]',  # p-[13px], m-[27px]
    r'\b[a-z]+-\[\d+rem\]',  # p-[1.3rem]
    r'\b[a-z]+-\[\d+%\]',   # w-[50%] (sometimes acceptable)
    r'\bgap-\[\d+',         # gap-[15px]
    r'\bspace-[xy]-\[\d+',  # space-x-[10px]
]

# Non-standard spacing values (not in Tailwind scale)
# Valid values: 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
VALID_SPACING_VALUES = {
    "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6",
    "7", "8", "9", "10", "11", "12", "14", "16", "20", "24", "28", "32",
    "36", "40", "44", "48", "52", "56", "60", "64", "72", "80", "96"
}

# Inline style patterns that could be className
INLINE_STYLE_PATTERNS = [
    r'style=\{\{[^}]*backgroundColor\s*:',
    r'style=\{\{[^}]*color\s*:',
    r'style=\{\{[^}]*padding\s*:',
    r'style=\{\{[^}]*margin\s*:',
    r'style=\{\{[^}]*borderRadius\s*:',
    r'style=\{\{[^}]*borderColor\s*:',
    r'style=\{\{[^}]*borderWidth\s*:',
]

# Exceptions - files/patterns to skip
SKIP_PATTERNS = [
    r'node_modules',
    r'\.test\.',
    r'\.spec\.',
    r'__tests__',
    r'components/ui/',  # UI primitives are allowed to use any styling
    r'\.d\.ts$',
    r'tailwind\.config',
    r'\.config\.',
]


def should_skip_file(file_path: str) -> bool:
    """Check if file should be skipped."""
    for pattern in SKIP_PATTERNS:
        if re.search(pattern, file_path):
            return True
    return False


def is_semantic_color(match: str) -> bool:
    """Check if a color class uses semantic tokens."""
    for pattern in ALLOWED_SEMANTIC_PATTERNS:
        if re.search(pattern, match):
            return True
    return False


def check_rn_imports(content: str, file_path: str) -> list[Violation]:
    """Check for React Native imports that should be Gluestack."""
    violations = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Check for import from react-native
        if 'from "react-native"' in line or "from 'react-native'" in line:
            for rn_component, gluestack_equiv in RN_TO_GLUESTACK_MAP.items():
                # Check if component is imported
                if re.search(rf'\b{rn_component}\b', line):
                    violations.append(Violation(
                        file=file_path,
                        line=i,
                        rule="gluestack-components",
                        message=f"Use Gluestack '{gluestack_equiv}' instead of React Native '{rn_component}'",
                    ))

    return violations


def check_raw_colors(content: str, file_path: str) -> list[Violation]:
    """Check for raw color values instead of semantic tokens."""
    violations = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Skip comments
        if line.strip().startswith('//') or line.strip().startswith('*'):
            continue

        for pattern in RAW_COLOR_PATTERNS:
            matches = re.findall(pattern, line)
            for match in matches:
                if isinstance(match, tuple):
                    match = '-'.join(match)
                if not is_semantic_color(match):
                    violations.append(Violation(
                        file=file_path,
                        line=i,
                        rule="semantic-tokens",
                        message=f"Use semantic color token instead of raw color '{match}'",
                    ))

    return violations


def check_arbitrary_values(content: str, file_path: str) -> list[Violation]:
    """Check for arbitrary bracket notation values."""
    violations = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Skip comments
        if line.strip().startswith('//') or line.strip().startswith('*'):
            continue

        for pattern in ARBITRARY_VALUE_PATTERNS:
            matches = re.findall(pattern, line)
            for match in matches:
                violations.append(Violation(
                    file=file_path,
                    line=i,
                    rule="no-arbitrary-values",
                    message=f"Avoid arbitrary values '{match}'. Use spacing scale instead.",
                    severity="warning",
                ))

    return violations


def check_inline_styles(content: str, file_path: str) -> list[Violation]:
    """Check for inline styles that could be className."""
    violations = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Skip comments
        if line.strip().startswith('//') or line.strip().startswith('*'):
            continue

        for pattern in INLINE_STYLE_PATTERNS:
            if re.search(pattern, line):
                # Check for exceptions (dynamic values, animations)
                if 'bottomInset' in line or 'Animated' in line or 'animatedValue' in line:
                    continue
                if 'Platform.select' in line or 'Platform.OS' in line:
                    continue

                violations.append(Violation(
                    file=file_path,
                    line=i,
                    rule="no-inline-styles",
                    message="Prefer className over inline style for static styling",
                    severity="warning",
                ))

    return violations


def check_non_scale_spacing(content: str, file_path: str) -> list[Violation]:
    """Check for spacing values not in the standard scale."""
    violations = []
    lines = content.split('\n')

    # Pattern to match spacing classes: p-X, m-X, gap-X, etc.
    spacing_pattern = r'\b(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)-(\d+\.?\d*)\b'

    for i, line in enumerate(lines, 1):
        # Skip comments
        if line.strip().startswith('//') or line.strip().startswith('*'):
            continue

        matches = re.findall(spacing_pattern, line)
        for prefix, value in matches:
            if value not in VALID_SPACING_VALUES:
                violations.append(Violation(
                    file=file_path,
                    line=i,
                    rule="spacing-scale",
                    message=f"Spacing value '{value}' is not in the standard scale. Use a valid value: {', '.join(sorted(VALID_SPACING_VALUES, key=lambda x: float(x) if x != 'px' else 0.1))}",
                    severity="warning",
                ))

    return violations


def validate_file(file_path: str) -> list[Violation]:
    """Validate a single file for styling violations."""
    if should_skip_file(file_path):
        return []

    # Only check TypeScript/JavaScript files
    if not file_path.endswith(('.tsx', '.ts', '.jsx', '.js')):
        return []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except (IOError, UnicodeDecodeError):
        return []

    violations = []
    violations.extend(check_rn_imports(content, file_path))
    violations.extend(check_raw_colors(content, file_path))
    violations.extend(check_arbitrary_values(content, file_path))
    violations.extend(check_inline_styles(content, file_path))
    violations.extend(check_non_scale_spacing(content, file_path))

    return violations


def validate_directory(directory: str) -> list[Violation]:
    """Validate all files in a directory recursively."""
    violations = []

    for root, dirs, files in os.walk(directory):
        # Skip node_modules and other excluded directories
        dirs[:] = [d for d in dirs if not should_skip_file(os.path.join(root, d))]

        for file in files:
            file_path = os.path.join(root, file)
            violations.extend(validate_file(file_path))

    return violations


def format_violation(violation: Violation) -> str:
    """Format a violation for display."""
    severity_icon = "❌" if violation.severity == "error" else "⚠️"
    return f"{severity_icon} {violation.file}:{violation.line} [{violation.rule}] {violation.message}"


def main():
    """Main entry point."""
    # Get path from command line or use current directory
    path = sys.argv[1] if len(sys.argv) > 1 else "."

    # Resolve to absolute path
    path = os.path.abspath(path)

    if not os.path.exists(path):
        print(f"❌ Path not found: {path}")
        sys.exit(1)

    print(f"🔍 Validating styling patterns in: {path}\n")

    # Validate
    if os.path.isfile(path):
        violations = validate_file(path)
    else:
        violations = validate_directory(path)

    # Report results
    if not violations:
        print("✅ No styling violations found!")
        sys.exit(0)

    # Group by file
    by_file: dict[str, list[Violation]] = {}
    for v in violations:
        if v.file not in by_file:
            by_file[v.file] = []
        by_file[v.file].append(v)

    # Print violations
    error_count = 0
    warning_count = 0

    for file_path, file_violations in sorted(by_file.items()):
        print(f"\n📄 {file_path}")
        for v in sorted(file_violations, key=lambda x: x.line):
            print(f"   {format_violation(v)}")
            if v.severity == "error":
                error_count += 1
            else:
                warning_count += 1

    print(f"\n📊 Summary: {error_count} errors, {warning_count} warnings")

    # Exit with error if there are errors
    if error_count > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
