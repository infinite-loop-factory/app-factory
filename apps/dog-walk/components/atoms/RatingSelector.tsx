import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { Star } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";

interface RatingSelectorProps {
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

export default function RatingSelector({ rate, setRate }: RatingSelectorProps) {
  const RateIconStyle = tva({
    variants: {
      variant: {
        default: "h-8 w-8 text-typography-500",
        active: "h-8 w-8 text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  return (
    <HStack className="justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={`review_${star}`}
          onPress={() => {
            setRate(star);
          }}
        >
          <Icon
            as={Star}
            className={RateIconStyle({
              variant: star <= rate ? "active" : "default",
            })}
          />
        </TouchableOpacity>
      ))}
    </HStack>
  );
}
