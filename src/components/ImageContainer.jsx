import { BASE_URL, DEFAULT_IMAGE } from "../constants";

const ImageContainer = ({
  src = DEFAULT_IMAGE,
  size = "100%",
  alt,
  borderRadius = "0px",
}) => {
  const imageSrc =
    src?.startsWith("/uploads/") ? `${BASE_URL}${src}` : src || DEFAULT_IMAGE;

  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: size,
    paddingBottom: size,
    height: 0,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f2f2f2",
    borderRadius,
  };

  const styles = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    inset: 0,
  };

  return (
    <div style={divStyle}>
      <img src={imageSrc} style={styles} alt={alt} />
    </div>
  );
};

export default ImageContainer;