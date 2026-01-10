import { render } from "@testing-library/react-native";
import { ThemedText } from "@/components/ui/themed-text";

it("renders correctly", () => {
  const tree = render(<ThemedText>Snapshot test!</ThemedText>);

  expect(tree).toMatchSnapshot();
});
