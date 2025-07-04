// src/components/SomeAiComponent/SentimentButton.jsx
import React, { useState } from 'react';
import { axiosInstance } from '../../index';
import CommentCard from '../CommentComponent/CommentCard';
import '../../styles/ai.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

function SentimentButton({ tweet, comments, user, isAuthenticated }) {
    const [sentiment, setSentiment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');

    const fetchSentiment = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/ai/tweets-sentiment/${tweet.id}/`);
            setSentiment(res.data);
        } catch (err) {
            setSentiment({ results: [], error: true });
        } finally {
            setLoading(false);
        }
    };

    const labeledSentiment = sentiment?.results?.map((item) => {
        let label = 'Neutral';
        if (item.polarity > 0.2) label = 'Positive';
        else if (item.polarity < -0.2) label = 'Negative';
        return { ...item, label };
    }) || [];

    const filteredSentiment = filter === 'All'
        ? labeledSentiment
        : labeledSentiment.filter(item => item.label === filter);

    const count = {
        positive: labeledSentiment.filter(i => i.label === 'Positive').length,
        neutral: labeledSentiment.filter(i => i.label === 'Neutral').length,
        negative: labeledSentiment.filter(i => i.label === 'Negative').length,
    };

    const avgPolarity = labeledSentiment.reduce((sum, i) => sum + i.polarity, 0) / labeledSentiment.length || 0;
    const overallSentiment = avgPolarity > 0.2 ? 'Positive' : avgPolarity < -0.2 ? 'Negative' : 'Neutral';
    const sentimentSuggestion = overallSentiment === 'Positive'
        ? 'Great! Your tweet is well received. \ud83c\udf89'
        : overallSentiment === 'Negative'
            ? 'Consider improving the tweet or engaging with your audience. \ud83e\udd14'
            : 'Your tweet is getting mixed reactions. \ud83d\ude10';

    return (
        <div className="mt-3 mb-3">
            <button className="link-tweet" onClick={fetchSentiment} disabled={loading}>
                {loading ?
                    <>
                        Analyzing...
                        <FontAwesomeIcon icon={faRobot} flip className="ml-1" />
                    </>
                    :
                    <>
                        Run Sentiment AI
                        <FontAwesomeIcon icon={faRobot} bounce className="ml-1" />
                    </>
                }
            </button>

            {sentiment && (
                <div className="sentiment-container">
                    <h5 className="sentiment-heading">Sentiment Analysis Results:</h5>
                    <p className="sentiment-overall">
                        <strong>Overall Sentiment:</strong>{' '}
                        <span className={
                            overallSentiment === 'Positive' ? 'sentiment-positive' :
                                overallSentiment === 'Negative' ? 'sentiment-negative' :
                                    'sentiment-neutral'
                        }>
                            {overallSentiment}
                        </span>
                    </p>
                    <p>Average Polarity: {avgPolarity.toFixed(2)}</p>
                    <p ><span className='text-success' >Positive: {count.positive}</span> , 
                    <span className='text-primary'>Neutral: {count.neutral} </span>,
                    <span className='text-danger' >Negative: {count.negative}</span>
                    </p>

                    <p className="sentiment-suggestion">
                        <strong>Suggestion:</strong> {sentimentSuggestion}
                    </p>

                    <label htmlFor="sentimentFilter"><strong>Filter Comments :</strong></label>{' '}
                    <select
                        id="sentimentFilter"
                        className="sentiment-dropdown"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Positive">Positive</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Negative">Negative</option>
                    </select>

                    <div>
                        {sentiment.results.length === 0 ? (
                            <h2 className="text-center">No comments to analyze yet.</h2>
                        ) : (
                            comments.commentList
                                .filter(c => filteredSentiment.find(f => f.comment_id === c.id))
                                .map((comment) => (
                                    <CommentCard
                                        tweetId={tweet.id}
                                        user={isAuthenticated ? user : ''}
                                        key={comment.id}
                                        comment={comment}
                                    />
                                ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SentimentButton;
