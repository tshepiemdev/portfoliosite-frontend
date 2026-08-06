import { useState } from "react";
import styles from "../styles/CommentsWrapper.module.css";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import CommentModal from "./CommentModal";
import CommentBox from "./CommentBox";
import ImagePreviewModal from "./ImagePreviewModal";
import defaultIcon from "../assets/images/myphoto.jpg";

export default function CommentsWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewData, setPreviewData] = useState(null);

  const commentsData = [
    {
      name: "Tshepang",
      surname: "kgaphola",
      email: "hello@tshepang.com",
      icon: "",
      text: "Hello this is my first comment ✌️❤️, yayy",
      image: defaultIcon,
      timestamp: "Saturday, 5:10 pm",
    },
    {
      name: "Punyete",
      surname: "rsa",
      email: "lerato@elias.com",
      icon: "",
      text: "❤️😂✌️✌️❤️✋😭🤤🍑🍑🥥🍌🍎🍎😊❤️😂✌️✌️❤️✋😭🤤🍑🍑🥥🍌🍎🍎😊🫡😂✌️🥥😭😭🔨🤣😍😍©️🍌🥥😂😭✋🍎😉😉✋😭✨🍑🫡😂✌️🥥😭😭🔨🤣😍😍©️🍌🥥😂😭✋🍎😉😉✋😭✨🍑",
      timestamp: "Friday, 11:23 am",
    },
    {
      name: "Elias",
      surname: "Kgaphola",
      email: "lerato@elias.com",
      icon: "",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia et dolore, quam eligendi aliquam illum tempora optio necessitatibus, iure ducimus, earum soluta unde veritatis culpa quidem rerum numquam architecto quisquam!",
      image: defaultIcon,
      timestamp: "Friday, 11:23 am",
    },
    {
      name: "Lerato",
      surname: "Mokoena",
      email: "lerato@mokoena.com",
      icon: "",
      text: "Working with Tshepang was a great experience😊. He delivered a clean, responsive website that improved our online presence significantly.",
      timestamp: "Friday, 11:23 am",
    },
    {
      name: "Thabo",
      surname: "Nkosi",
      email: "hello@nkosi.com",
      icon: "",
      text: "Very professional and easy to work with. He understood our vision and turned it into a functional and modern web application.",
      image: defaultIcon,
      timestamp: "Tuesday, 6:01 am",
    },
    {
      name: "Sipho",
      surname: "Dlamini",
      email: "hello@dlamini.com",
      icon: "",
      text: "My website now looks professional and works perfectly on mobile. Great attention to detail.",
      timestamp: "Sunday, 5:10 pm",
    },
  ];

  const [likes, setLikes] = useState(
    commentsData.map(() => ({
      liked: false,
      count: 0,
    })),
  );

  const handleLike = (index) => {
    setLikes((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              liked: !item.liked,
              count: item.liked ? item.count - 1 : item.count + 1,
            }
          : item,
      ),
    );
  };

  const handleImagePreview = (comment, image) => {
    setPreviewData({
      src: image,
      alt: `${comment.name} ${comment.surname}`,
      pageName: `${comment.name} ${comment.surname}`,
      imageDescription: comment.text,
    });
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.topWrapper}>
        <h2 className={styles.heading}>Comments</h2>
        <h2 className={styles.countLbl}>• {commentsData.length}</h2>

        <BtnCTAWhiteSmall
          buttonText="Post a comment"
          onClick={""}
        />
      </div>

      <div className={styles.commentsList}>
        {commentsData.map((comment, index) => (
          <CommentBox
            key={`${comment.email}-${index}`}
            indexId={index}
            profileImg={comment.icon}
            name={comment.name}
            surname={comment.surname}
            text={comment.text}
            textImg={comment.image}
            timestamp={comment.timestamp}
            likes={likes[index].count}
            liked={likes[index].liked}
            onLike={() => handleLike(index)}
            onImageClick={(image) => handleImagePreview(comment, image)}
          />
        ))}
      </div>

      {commentsData.length === 0 && (
        <div className={styles.noCommentsView}>
          <h2 className={styles.bigheading}>
            0 Comments found,
            <br />
            be the first to comment ✌️❤️
          </h2>

          <BtnCTAWhite
            buttonText="Post a comment"
            onClick={""}
          />
        </div>
      )}

      <ImagePreviewModal
        src={previewData?.src}
        alt={previewData?.alt}
        pageName={previewData?.pageName}
        imageDescription={previewData?.imageDescription}
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
      />

      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
