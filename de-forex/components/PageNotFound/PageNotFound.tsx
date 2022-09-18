import styles from "./PageNotFound.module.css";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";

const PageNotFound = ({ titleText, text } : { titleText: string, text: string}) => {
  return (
    <div className={styles.wrapper_page_not_found}>
        <div className={styles.image_background}>
          <Image
            // layout="responsive"
            width={300}
            height={700}
            src="/background_image_page_not_found.svg"
            alt="icon-check-green-image"
          />
        </div>
      <div className={styles.wrapper_image_card}>
        <p className={styles.error_title}>{titleText}</p>
        <p className={styles.error_text}>{text}</p>
      </div>
      <Link href="/dashboard">
        <a>
          <div className={styles.wrapper_button}>
            <Button onClick={() => 2} title="Open Dashboard" />
          </div>
        </a>
      </Link>
    </div>
  );
};

export default PageNotFound