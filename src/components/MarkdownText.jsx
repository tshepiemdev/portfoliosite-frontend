import styles from "../styles/MarkdownText.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownText({ text, radius }) {
  return (
    <div
      className={styles.markdownTextContent}
      style={{ borderRadius: radius }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
