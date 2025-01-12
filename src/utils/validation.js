const isValidMedia = (url) => {
  if (!url || typeof url !== "string") return false; // Handle invalid input

  const mediaRegex =
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|mp4|mov|webm)(\?.*)?)$/i;

  return mediaRegex.test(url);
};

export default isValidMedia;
