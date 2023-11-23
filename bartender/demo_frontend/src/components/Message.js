import React from 'react';
import './Message.css'; // Import your CSS file

const Message = ({ data, isSender }) => (
  <div className={`message ${isSender ? 'sender' : 'receiver'}`}>
    <p>{data}</p>
  </div>
);

export default Message;
