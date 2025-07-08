import React from "react";
import { Link } from "react-router-dom";

const FollowListModal = ({ show, onClose, users, title }) => {
  if (!show) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h4>{title}</h4>
        <button className="close-btn" onClick={onClose}>X</button>
        <ul className="follow-list">
          {users.length === 0 && <li>No users found.</li>}
          {users.map(user => (
            <li key={user.username}>
              <Link to={`/${user.username}`}>
                <img src={user.avatar} alt={user.username} width={40} height={40} className="rounded-circle" />
                <span className="mx-2">{user.username}</span>
                <span className="side-name">{user.bio}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowListModal;