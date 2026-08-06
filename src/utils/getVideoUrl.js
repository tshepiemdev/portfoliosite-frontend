export function getVideoUrl(url, provider) {
  if (!url) return "";

  switch (provider) {
    case "youtube": {
      const id =
        url.match(/(?:youtu\.be\/|v=|embed\/)([^?&]+)/)?.[1] || "";
      return `https://www.youtube.com/embed/${id}`;
    }

    case "direct":
      return url;

    default:
      return "";
  }
}