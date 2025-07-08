import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Second from "../components/Second";
import TweetHeader from "../components/TweetComponents/tweetHeader";
import { axiosInstance } from "../index";
import { userFollow } from "../redux/asyncActions/UserAsync";
import ClipLoader from "react-spinners/ClipLoader";


const FollowersFollowing = () => {
  const { username } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("followers");
  const userIn = useSelector((state) => state.userReducer);
  const authUser = userIn.user;

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const showType = search.get("type") || "followers";
    setType(showType);
    setLoading(true);
    axiosInstance
      .get(`user/${username}/${showType}/`)
      .then((res) => setList(res.data))
      .finally(() => setLoading(false));
  }, [username, location.search]);

  const handleFollow = (user) => {
    dispatch(userFollow(user.username));
    setList((prev) =>
      prev.map((u) =>
        u.username === user.username
          ? { ...u, i_follow: !u.i_follow }
          : u
      )
    );
  };

  return (
    <Second>
      <TweetHeader headerName={`${username}'s ${type.charAt(0).toUpperCase() + type.slice(1)}`} />
      <div className="d-flex border-bottom" style={{ marginTop: 10 }}>
        <button
          className={`link-tweet mx-2 ${type === "followers" ? "active-tab" : ""}`}
          style={{
            border: "none",
            background: "transparent",
            fontWeight: type === "followers" ? "bold" : "normal",
            borderBottom: type === "followers" ? "2px solid #c2184e" : "none",
            color: type === "followers" ? "#c2184e" : "white",
            cursor: "pointer"
          }}
          onClick={() => {
            if (type !== "followers") window.location.search = "?type=followers";
          }}
        >
          Followers
        </button>

        <button
          className={`link-tweet mx-2 ${type === "following" ? "active-tab" : ""}`}
          style={{
            border: "none",
            background: "transparent",
            fontWeight: type === "following" ? "bold" : "normal",
            borderBottom: type === "following" ? "2px solid #c2184e" : "none",
            color: type === "following  " ? "#c2184e" : "white",
            cursor: "pointer"
          }}
          onClick={() => {
            if (type !== "following") window.location.search = "?type=following";
          }}
        >
          Following
        </button>

      </div>
      <div className="center mt-2" style={{ flexDirection: "column", width: "100%" }}>
        {loading ? (
          <ClipLoader color="#f44" loading={true} size={23} />
        ) : list.length === 0 ? (
          <h5 className="text-center">No {type} found.</h5>
        ) : (
          list.map((user) => (
            <div
              key={user.username}
              className="d-flex align-items-center justify-content-between border-bottom py-3"
              style={{
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
                background: "transparent",
                position: "relative"
              }}
            >
              <Link to={`/${user.username}`} className="d-flex align-items-center" style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src={`${process.env.REACT_APP_DOMAIN.slice(0,-1)}${user.avatar}`}
                  alt={user.username}
                  className="rounded-circle"
                  width={48}
                  height={48}
                  style={{ objectFit: "cover" }}
                />
                <div className="mx-3">
                  <div className="bold-text">{user.username}</div>
                  <div className="side-name">{user.bio}</div>
                </div>
              </Link>
              {authUser && authUser.username !== user.username && (
                user.i_follow ? (
                  <button
                    className="followbtn border-only-btn"
                    style={{ position: "static", minWidth: 90 }}
                    onClick={() => handleFollow(user)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="link-tweet followbtn"
                    style={{ position: "static", minWidth: 90 }}
                    onClick={() => handleFollow(user)}
                  >
                    Follow
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </Second>
  );
};

export default FollowersFollowing;