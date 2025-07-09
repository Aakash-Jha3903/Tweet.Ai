import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { tweet_detail, deleteTweet, likeTweet, } from "../redux/asyncActions/TweetAsync";
import Second from "../components/Second";
import TweetHeader from "../components/TweetComponents/tweetHeader";
import { Link, useHistory } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { BiUserPlus, BiEditAlt, BiBlock } from "react-icons/bi";
import { removeMesage } from "../redux/slices/tweetSlice";
import AlertMessage from "../components/SmallComponent/alertMessage";
import { TweetOperation } from "../components/TweetOperation";
import { TweetContent } from "../components/TweetComponents/TweetContent";
import CommentCard from "../components/CommentComponent/CommentCard";
import { addComment, load_more_comment, tweet_comments, } from "../redux/asyncActions/CommentAsync";
import ClipLoader from "react-spinners/ClipLoader";
import AddPicker from "../components/SmallComponent/AddPicker";
import { axiosInstance } from "../index";
import SummarizeButton from "../components/SomeAiComponent/SummarizeButton";
import SentimentButton from "../components/SomeAiComponent/SentimentButton";

const TweetDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [editTitle, setEditTitle] = useState("");
  const [commentInput, setCommentInput] = useState("");

  const { id } = useParams();
  const tweet = useSelector((state) => state.tweetReducer.singleTweet);
  const userIn = useSelector((state) => state.userReducer);
  const { user, isAuthenticated } = userIn;
  const message = useSelector((state) => state.tweetReducer.message);
  const comments = useSelector((state) => state.commentReducer);
  const meta = comments.meta;

  useEffect(() => {
    dispatch(tweet_detail(id));
    dispatch(tweet_comments(id));
  }, [dispatch, id]);

  const likeTweetD = (id) => {
    dispatch(likeTweet(id));
  };

  message &&
    setTimeout(() => {
      dispatch(removeMesage());
    }, 3000);

  const editpost = () => {
    setEdit((prev) => !prev);
    setIsOpen(!isOpen);
    setEditTitle(tweet.title);
  };

  const commentAdd = () => {
    dispatch(addComment(id, commentInput));
    setCommentInput("");
  };

  const loadMoreComment = () => {
    if (meta?.next !== null) {
      dispatch(load_more_comment(id, meta.page + 1));
    }
  };

  // Sentiment
  const [sentiment, setSentiment] = useState(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [filter, setFilter] = useState("All");

  const fetchSentiment = async () => {
    setLoadingSentiment(true);
    try {
      const res = await axiosInstance.get(`ai/tweets-sentiment/${tweet.id}/`);
      setSentiment(res.data);
    } catch (err) {
      setSentiment({ results: [], error: true });
    }
    setLoadingSentiment(false);
  };

  const filteredResults = sentiment?.results?.filter((item) =>
    filter === "All" ? true : item.sentiment === filter
  );


  const labeledSentiment = sentiment?.results?.map((item) => {
    let label = "Neutral";
    if (item.polarity > 0.2) label = "Positive";
    else if (item.polarity < -0.2) label = "Negative";
    return { ...item, label };
  }) || [];


  const filteredSentiment = filter === "All"
    ? labeledSentiment
    : labeledSentiment.filter((item) => item.label === filter);

  const count = {
    positive: labeledSentiment.filter(i => i.label === "Positive").length,
    neutral: labeledSentiment.filter(i => i.label === "Neutral").length,
    negative: labeledSentiment.filter(i => i.label === "Negative").length,
  };

  const avgPolarity = labeledSentiment.reduce((sum, i) => sum + i.polarity, 0) / labeledSentiment.length || 0;

  const overallSentiment =
    avgPolarity > 0.2 ? "Positive" :
      avgPolarity < -0.2 ? "Negative" : "Neutral";

  const sentimentSuggestion =
    overallSentiment === "Positive"
      ? "Great! Your tweet is well received. 🎉"
      : overallSentiment === "Negative"
        ? "Consider improving the tweet or engaging with your audience. 🤔"
        : "Your tweet is getting mixed reactions. 😐";


  return (
    <div>
      {message && (
        <AlertMessage
          removeMesage={removeMesage}
          dispatch={dispatch}
          message={message}
        />
      )}

      {tweet.author && (
        <Second>
          <TweetHeader headerName="Detail" />

          <div className="tweetCard">
            <div className="actual-tweet">
              {isAuthenticated && (
                <span>
                  <FiMoreHorizontal className="dropdownIcon" />
                  <div className="dropdown-menu dropdown-menu-right dropdownMenu">
                    {user?.email === tweet?.author.email ? (
                      <>
                        <p onClick={editpost}>
                          <BiEditAlt /> <span>Edit Post</span>
                        </p>
                        <p
                          onClick={() => {
                            dispatch(deleteTweet(tweet.id));
                            history.push("/");
                          }}
                        >
                          <AiOutlineDelete color="#e0245e" />
                          <span style={{ color: "#e0245e" }}>Delete Post</span>
                        </p>
                      </>
                    ) : (
                      <p>
                        <BiBlock color="#e0245e" /> <span>Not your's Boi</span>
                      </p>
                    )}
                  </div>
                </span>
              )}

              <span className="add-tweet-image">
                <Link to={`/${tweet.author.username}`}>
                  <img
                    alt="img"
                    src={tweet.author.avatar}
                    className="rounded-circle author-image"
                    width="60px"
                    height="60px"
                  />
                </Link>
              </span>

              <TweetContent
                tweet={tweet}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                edit={edit}
                setEdit={setEdit}
                id={tweet.id}
                dispatch={dispatch}
              />

            </div>


            <TweetOperation
              user={isAuthenticated ? user : ""}
              id={parseInt(id)}
              liked={tweet.iliked}
              likeTweetD={likeTweetD}
              like_count={tweet.like_count}
              tweet={tweet}
              comment_count={tweet.comment_count}
              bookmark={tweet.i_bookmarked}
            />
          </div>


          {/* Tweet-Summarize Section */}
          <div className="mx-2 my-2">
            {tweet.title && tweet.title.length > 15 && (
              <SummarizeButton
                tweetId={tweet.id}
                tweetText={ tweet.title + tweet.body || tweet.title ||''}
              />
            )}
          </div>


          {/* Comments Section */}
          <section className="comment-list">
            {isAuthenticated && (
              <div className="commentDiv">
                <img
                  src={user?.avatar || "https://qph.fs.quoracdn.net/main-qimg-92e5c1d46505b34638aafd281449dabc"}
                  alt="comment-author"
                  className="authorImage"
                />
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="commentInput"
                  placeholder="Tweet your Reply ....."
                ></textarea>
                <AddPicker setInput={setCommentInput} />
                <button disabled={!commentInput} onClick={commentAdd} className="link-tweet">
                  {comments.uploading ? <ClipLoader color="white" loading={true} size={18} /> : "Reply"}
                </button>
              </div>
            )}


            {/* Sentiment Analysis Section */}
            <div className="mx-2">
              {comments?.commentList.length > 3 && (
                <SentimentButton
                  tweet={tweet}
                  comments={comments}
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </div>


            {comments?.isLoading ? (
              <span className="d-flex justify-content-center mt-4">
                <ClipLoader color="#f44" loading={true} size={23} />
              </span>
            ) : (
              comments?.commentList.map((comment) => (
                <>
                  <CommentCard
                    tweetId={tweet.id}
                    user={isAuthenticated ? user : ""}
                    key={comment.id}
                    comment={comment}
                  />

                </>
              ))
            )}

            {!comments.isLoading && meta?.next && (
              <div className="mt-3 d-flex justify-content-center">
                <button onClick={loadMoreComment} className="link-tweet">
                  Load more
                </button>
              </div>
            )}
          </section>
        </Second>
      )}
    </div>
  );
};

export default TweetDetail;