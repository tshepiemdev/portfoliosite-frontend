export const getShareOptions = ({
  siteUrl,
  siteName,
  handleCopyLink,
  openShareModal,
  icons,
}) => [
  {
    icon: icons.copyLink,
    label: "Copy link to clipboard",
    action: handleCopyLink,
  },
  {
    icon: icons.share,
    label: "Share",
    action: openShareModal,
  },
  {
    icon: icons.threads,
    label: "Share on Threads",
    url: `https://www.threads.net/intent/post?text=${encodeURIComponent(
      `${siteName || ""} ${siteUrl}`,
    )}`,
  },
  {
    icon: icons.x,
    label: "Share on X",
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      siteUrl,
    )}&text=${encodeURIComponent(siteName || "")}`,
  },
  {
    icon: icons.linkedIn,
    label: "Share on LinkedIn",
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      siteUrl,
    )}`,
  },
];
