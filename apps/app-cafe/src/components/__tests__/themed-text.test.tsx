import { render } from "@testing-library/react-native";
import { ThemedText } from "@/components/themed-text";

test("renders correctly", () => {
  const tree = render(<ThemedText>Snapshot test!</ThemedText>).toJSON();

  expect(tree).toMatchSnapshot();
});
