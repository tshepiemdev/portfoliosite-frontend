import styles from "../styles/SocialIconsWrapper.module.css";
import SocialIcon from "./SocialIcon";
import websiteImg from "../assets/icons/globe (1).svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import githubImg from "../assets/icons/github.svg";
import instaImg from "../assets/icons/instagram-logo-fill.svg";
import youtubeImg from "../assets/icons/youtube.svg";
import discordImg from "../assets/icons/discord.svg";
import xImg from "../assets/icons/twitter-alt.svg";
import dribbbleImg from "../assets/icons/dribbble.svg";
import messengerImg from "../assets/icons/facebook-messenger.svg";

import chatgptImg from "../assets/icons/openai.svg";
import geminiImg from "../assets/icons/gemini.svg";
import claudeImg from "../assets/icons/claude.svg";
import threadsImg from "../assets/icons/threads.svg";
import contactInfo from "../config/contactInfo";

const iconsMap = {
  website: websiteImg,
  GitHub: githubImg,
  LinkedIn: linkedInImg,
  Twitter: xImg,
  Facebook: messengerImg,
  YouTube: youtubeImg,
  Instagram: instaImg,
  Discord: discordImg,
  Dribbble: dribbbleImg,
  Threads: threadsImg,
  Chatgpt: chatgptImg,
  Gemini: geminiImg,
  Claude: claudeImg,
};

export default function SocialIconsWrapper({
  text,
  filter = "invert(1)",
  only = [],
}) {
  const socialItems =
    only.length > 0
      ? contactInfo.social.filter((item) => only.includes(item.name))
      : contactInfo.social;

  return (
    <div className={styles.socialIconsSWrapper}>
      {text && <span className={styles.text}>{text}</span>}

      <div className={styles.icons}>
        {socialItems.map((item) => (
          <SocialIcon
            key={item.name}
            href={item.url}
            imgSrc={iconsMap[item.name]}
            alt={item.name}
            filter={filter}
          />
        ))}
      </div>
    </div>
  );
}
