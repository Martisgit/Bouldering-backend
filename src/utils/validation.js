const isValidMedia = (url) => {
  if (!url || typeof url !== "string") return false; // Handle invalid input

  // ✅ Allow images (png, jpg, jpeg, gif) and videos (mp4, mov, webm)
  const mediaRegex =
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|mp4|mov|webm)(\?.*)?)$/i;

  // ✅ Allow YouTube links (youtube.com, youtu.be)
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  return mediaRegex.test(url) || youtubeRegex.test(url);
};

export default isValidMedia;
