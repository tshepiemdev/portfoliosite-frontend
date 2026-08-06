export const convertDriveToPreview = (url) => {
  if (!url) return "";

  if (url.includes("/preview")) return url;

  const match = url.match(/\/d\/(.*?)\//);
  if (!match) return url;

  const fileId = match[1];
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

export const convertDriveToDownload = (url) => {
  if (!url) return "";

  const match = url.match(/\/d\/(.*?)\//);
  if (!match) return url;

  const fileId = match[1];
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};
