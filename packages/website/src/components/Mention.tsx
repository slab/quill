import styles from "./Mention.module.scss";

interface IMentionProps {
  value: string;
}

const linksMap = {
  "Vincent Chan": "https://github.com/vincentdchan",
}

function Mention(props: IMentionProps) {
  const link = linksMap[props.value as keyof typeof linksMap];
  return (
    <>
      <span></span>
      <a className={styles.mention} href={link} target="_blank" rel="noopener noreferrer">@{props.value}</a>
      <span></span>
    </>
  );
}

export default Mention;
