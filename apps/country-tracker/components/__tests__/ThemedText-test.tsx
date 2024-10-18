import renderer from "react-test-renderer";

import { Text } from "@/components/ui/text";

it("renders correctly", () => {
  const tree = renderer.create(<Text>Snapshot test!</Text>).toJSON();

  expect(tree).toMatchSnapshot();
});
