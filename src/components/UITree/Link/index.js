import { LinkWrapper } from "./styled";

const Link = ({ content, children }) => {
  return <LinkWrapper href={content}>{children}</LinkWrapper>;
};

export default Link;
