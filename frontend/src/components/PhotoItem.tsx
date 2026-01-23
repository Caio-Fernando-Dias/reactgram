import "./PhotoItem.css";

import { uploads } from "../utils/config";
import { Link } from "react-router-dom";

interface IPhotoItemProps {
  photo: any;
}

const PhotoItem = ({ photo }: IPhotoItemProps) => {
  if (!photo) return null;

  return (
    <div className="photo-item">
      {photo.image && (
        <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
      )}
      <h2>{photo.title}</h2>
      <p className="photo-author">
        Publicado por:{" "}
        <Link to={`/users/${photo.userId}`}> {photo.userName}</Link>
      </p>
    </div>
  );
};

export default PhotoItem;
