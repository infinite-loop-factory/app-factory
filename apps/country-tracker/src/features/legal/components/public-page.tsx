import type { ReactNode } from "react";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

type PublicPageSection = {
  title: string;
  paragraphs: string[];
};

type PublicPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: PublicPageSection[];
  footer?: ReactNode;
};

export function PublicPage({
  eyebrow,
  title,
  summary,
  sections,
  footer,
}: PublicPageProps) {
  return (
    <ParallaxScrollView>
      <Box className="gap-4 px-1 pt-2 pb-10">
        <Box className="gap-2">
          <Text className="font-bold text-primary-600 text-xs uppercase tracking-[1.5px]">
            {eyebrow}
          </Text>
          <Heading className="font-bold text-3xl text-typography-950">
            {title}
          </Heading>
          <Text className="text-base text-typography-600 leading-7">
            {summary}
          </Text>
        </Box>

        <Divider className="bg-outline-100" />

        {sections.map((section) => (
          <Box className="gap-2" key={section.title}>
            <Heading className="font-bold text-typography-900 text-xl">
              {section.title}
            </Heading>
            {section.paragraphs.map((paragraph) => (
              <Text
                className="text-base text-typography-700 leading-7"
                key={paragraph}
              >
                {paragraph}
              </Text>
            ))}
          </Box>
        ))}

        {footer ? (
          <>
            <Divider className="bg-outline-100" />
            {footer}
          </>
        ) : null}
      </Box>
    </ParallaxScrollView>
  );
}
