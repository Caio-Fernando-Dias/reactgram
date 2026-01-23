import "./LikeContainer.css";

import { BsHeart, BsHeartFill } from "react-icons/bs";

interface ILikeContainerProps {
  photo: any;
  user: any;
  handleLike: any;
}
const LikeContainer = ({ photo, user, handleLike }: ILikeContainerProps) => {
  return (
    <div className="like">
      {photo.likes && user && (
        <>
          {photo.likes.includes(user._id) ? (
            <BsHeartFill />
          ) : (
            <BsHeart onClick={() => handleLike(photo)} />
          )}
          <p>{photo.likes.length} likes(s)</p>
        </>
      )}
    </div>
  );
};

export default LikeContainer;
