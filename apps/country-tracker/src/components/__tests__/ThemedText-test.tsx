import { render } from "@testing-library/react-native";

import { Text } from "@/components/ui/text";

it("renders correctly", () => {
  const tree = render(<Text>Snapshot test!</Text>);

  expect(tree).toMatchSnapshot();
});
