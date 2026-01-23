import "./Message.css";

type MessageProps = {
  msg: string;
  type: string;
};

const Message = ({msg, type}: MessageProps) => {
  return (
    <div className={`message ${type}`}>
      <p>{msg}</p>
    </div>
  );
};

export default Message;
