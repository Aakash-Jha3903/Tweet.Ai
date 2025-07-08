import React, { useEffect, useState } from "react";
import { userFollow, userProfile } from "../redux/asyncActions/UserAsync";
import { useDispatch, useSelector } from "react-redux";
import Second from "../components/Second";
import Moment from "moment";
import useUserInfo from "../hooks/useUserInfo";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import TweetHeader from "../components/TweetComponents/tweetHeader";
import Viewer from "react-viewer";
import ClipLoader from "react-spinners/ClipLoader";
import { tweet_specific_user } from "../redux/asyncActions/TweetAsync";
import TweetPostCard from "../components/TweetComponents/TweetPostCard";
import { removeMesage } from "../redux/slices/tweetSlice";
import AlertMessage from "../components/SmallComponent/alertMessage";
import UserEditModal from "../components/UserRelated/UserEditModal";
import { FollowInfo } from "../components/SmallComponent/FollowInfo";
import FollowListModal from "../components/UserRelated/FollowListModal"; // <-- import
import { axiosInstance } from "../index";

const Profile = () => {
  const { username } = useParams();
  const { user: authUser } = useUserInfo();
  const [showUserModal, setShowUserModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [covervisible, setCoverVisible] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const dispatch = useDispatch();
  const userIn = useSelector((state) => state.userReducer);
  const isAuthenticated = userIn.isAuthenticated;
  const tweetsInfo = useSelector((state) => state.tweetReducer);
  const tweets = tweetsInfo.tweets;
  const message = tweetsInfo.message;
  const userprofile = userIn.profileUser;
  const history = useHistory();

  message &&
    setTimeout(() => {
      dispatch(removeMesage());
    }, 3000);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(userProfile(username));
      dispatch(tweet_specific_user(username));
    }
  }, [dispatch, username, history, isAuthenticated]);

  // Fetch followers/following lists
  const fetchFollowers = async () => {
    try {
      const res = await axiosInstance.get(`user/${username}/followers/`);
      setFollowersList(res.data);
      setShowFollowers(true);
    } catch (err) {
      setFollowersList([]);
      setShowFollowers(true);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axiosInstance.get(`user/${username}/following/`);
      setFollowingList(res.data);
      setShowFollowing(true);
    } catch (err) {
      setFollowingList([]);
      setShowFollowing(true);
    }
  };

  return (
    <div>
      <Second>
        {message && (
          <AlertMessage
            removeMesage={removeMesage}
            dispatch={dispatch}
            message={message}
          />
        )}

        {userIn.isLoading ? (
          <span className="d-flex justify-content-center mt-4">
            <ClipLoader color="#f44" loading={true} size={23} />
          </span>
        ) : (
          <>
            <TweetHeader headerName="profile" />
            <div style={{ position: "relative" }}>
              <img
                onClick={() => setCoverVisible(true)}
                src={userprofile?.cover_image}
                alt="cover background"
                className="cover-image"
              />

              <img
                onClick={() => setVisible(true)}
                src={userprofile?.avatar}
                alt="profile background"
                className="rounded-circle profile-image"
              />
              {showUserModal && (
                <UserEditModal
                  user={authUser}
                  setShowUserModal={setShowUserModal}
                />
              )}
              <Viewer
                visible={visible}
                onClose={() => {
                  setVisible(false);
                }}
                images={[{ src: userprofile?.avatar, alt: "background" }]}
              />

              <Viewer
                visible={covervisible}
                onClose={() => {
                  setCoverVisible(false);
                }}
                images={[{ src: userprofile?.cover_image, alt: "background" }]}
              />
              {/* editprofile or follow button section depending on the user */}
              {authUser?.email === userprofile?.email ? (
                <div className="follow-or-edit">
                  <button
                    className="link-tweet"
                    type="button"
                    data-toggle="modal"
                    data-target="#userModal"
                  >
                    Edit Profile
                  </button>

                  <UserEditModal user={userprofile} modalId="userModal" />
                </div>
              ) : (
                <div className="follow-or-edit">
                  <Link to={`/messages/w/${userprofile?.username}`}>
                    <i className="largeicon mx-3 ">
                      <BiSend />
                    </i>
                  </Link>

                  {userprofile?.i_follow ? (
                    <button
                      onClick={() => dispatch(userFollow(userprofile.username))}
                      className="link-tweet "
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => dispatch(userFollow(userprofile.username))}
                      className="link-tweet"
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="user-info">
              <p>
                {userprofile?.username} <br />
                <span className="side-name">@{userprofile?.nickname}</span>
              </p>
              <p>
                {userprofile?.bio}
                <span className="side-name">
                  <i className="tweetIcons">
                    <AiOutlineSchedule />
                  </i>
                  <span className="mx-2">
                    joined
                    {Moment(userprofile?.date_joined).format("MMMM Do YYYY")}
                  </span>
                </span>
              </p>
              <div className="d-flex">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push(`/${userprofile?.username}/followers-following?type=followers`)}
                >
                  <FollowInfo
                    number={userprofile?.followers}
                    followinfo="followers"
                  />
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push(`/${userprofile?.username}/followers-following?type=following`)}
                >
                  <FollowInfo
                    number={userprofile?.following}
                    followinfo="following"
                  />
                </span>
              </div>
            </div>
          </>
        )}

        {/* Followers Modal */}
        <FollowListModal
          show={showFollowers}
          onClose={() => setShowFollowers(false)}
          users={followersList}
          title="Followers"
        />
        {/* Following Modal */}
        <FollowListModal
          show={showFollowing}
          onClose={() => setShowFollowing(false)}
          users={followingList}
          title="Following"
        />

        {tweets.map((tweet) => (
          <TweetPostCard
            user={authUser}
            dispatch={dispatch}
            tweet={tweet}
            key={tweet.id}
          />
        ))}
      </Second>
      <div></div>
    </div>
  );
};

export default Profile;

