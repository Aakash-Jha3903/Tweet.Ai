import React, {  useState } from "react";
import { BsSearch } from "react-icons/bs";
import { searchTweet } from "../redux/asyncActions/TweetAsync";
import { useDispatch, useSelector } from "react-redux";
import "../styles/explore.css";
import { Link } from "react-router-dom";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const tweetsInfo = useSelector((state) => state.notificationReducer);
  const searchResult = tweetsInfo.searchQuery;
  const isAuthenticated = useSelector(
    (state) => state.userReducer.isAuthenticated
  );
  const searchMe = (e) => {
    e.preventDefault();

      dispatch(searchTweet(query,isAuthenticated));
  
  };
  return (
    <form
      autoComplete="off"
      onSubmit={searchMe}
      className="mt-2 position-relative d-flex justify-content-center mb-4"
    >
      <BsSearch className="searchicons" />
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        onKeyUp={searchMe}
        type="text"
        className="searchinput"
        id="search-bar"
        placeholder="Search Tweet.Ai"
      />
      {searchResult.length > 0 && (
        <div className="resultDiv">
          {searchResult.map((res) => (
            <Link to={`${res.username}`} key={res.id}>
              <SearchResult res={res} />
            </Link>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchInput;

export const SearchResult = ({ res }) => {
  return (
    <div className="d-flex result">
      <img className="authorImage" src={res?.avatar || "https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"}
       alt="profile-pic" />
      <div className="mx-3">
        <strong>{res.username}</strong>
        <p className="side-name">{res.bio}</p>
      </div>
    </div>
  );
};
