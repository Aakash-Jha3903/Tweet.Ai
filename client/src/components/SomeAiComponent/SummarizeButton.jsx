// src/components/SomeAiComponent/SummarizeButton.jsx
import React, { useState } from 'react';
import { axiosInstance } from "../../index";
import "../../styles/ai.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

function SummarizeButton({ tweetId, tweetText }) {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        setLoading(true);
        setError('');
        setSummary('');

        try {
            const response = await axiosInstance.post(
                '/ai/tweet-summarize/',
                { text: tweetText },
                { timeout: 15000 }  // custom timeout override here, due to less-system resources, And Ai-models taking longer to respond
            );

            setSummary(response.data.summary);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Could not connect to server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <button
                onClick={handleSummarize}
                className='link-tweet'
                disabled={loading}
            >
                {/* ' 🤖'} */}
                {loading ?
                    <>
                        Summarizing....
                        <FontAwesomeIcon icon={faRobot} flip className="ml-1" />
                    </> :

                    <>
                        Summarize.Ai 
                        <FontAwesomeIcon icon={faRobot}  className="ml-1" />
                    </>
                }
            </button>

            {
                summary && (
                    <p className="mt-2 text-sm text-gray-800">
                        <strong>Summary by AI 🤖 : </strong>
                        <br /> {summary}
                    </p>
                )
            }

            {
                error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                )
            }
        </div >
    );
}

export default SummarizeButton;
