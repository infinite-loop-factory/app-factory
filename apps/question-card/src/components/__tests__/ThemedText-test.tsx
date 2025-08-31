import { render } from "@testing-library/react-native";
import { ThemedText } from "@/components/ThemedText";

it("renders correctly", () => {
  const tree = render(<ThemedText>Snapshot test!</ThemedText>);

  expect(tree).toMatchSnapshot();
});
