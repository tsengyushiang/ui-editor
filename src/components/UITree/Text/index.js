import { TextWrapper } from "./styled";

const Text = ({ content = "Text" }) => {
  return <TextWrapper>{content}</TextWrapper>;
};

export default Text;
