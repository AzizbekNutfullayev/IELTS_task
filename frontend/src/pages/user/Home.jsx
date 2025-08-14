import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTime, setQuestionTime] = useState(10);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleStart = async () => {
    setGameStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    try {
      const res = await axios.get("http://localhost:1111/user/viewquestions");

      const limitedQuestions = res.data
        .slice(0, 10)
        .map(q => ({
          ...q,
          options: q.options
            .map(opt => ({
              ...opt,
              correct: opt.correct === true || opt.correct === "true" || opt.correct === 1
            }))
            .sort(() => Math.random() - 0.5)
        }))
        .sort(() => Math.random() - 0.5);

      setQuestions(limitedQuestions);
    } catch (err) {
      console.log(err);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!gameStarted || !currentQuestion) return;

    setQuestionTime(10);
    setShowCorrect(false);
    setSelectedAnswer(null);

    const timer = setInterval(() => {
      setQuestionTime(prev => {
        if (prev === 1) {
          revealAnswer();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, currentQuestionIndex]);

  const handleAnswer = (option) => {
    setSelectedAnswer(option.id);

    if (option.correct) {
      setScore(prev => prev + 1);
    }

    revealAnswer();
  };

  const revealAnswer = () => {
    setShowCorrect(true);
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 2000);
    }
  };

  const submitScore = async () => {
    try {
      await axios.post("https://your-api.com/scores", { score });
      alert("Score submitted!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTryAgain = () => {
    handleStart();
  };

  return (
    <>
      <Header />
      <div className="container">
        {!gameStarted ? (
          <button className="btn" onClick={handleStart}>Start</button>
        ) : currentQuestion ? (
          <div>
            <h2 className="timer">Time left: {questionTime}s</h2>
            <div className="question">{currentQuestion.question_body}</div>
            <div className="options">
              {currentQuestion.options.map(option => {
                let classes = "option";
                if (showCorrect) {
                  if (option.correct) classes += " correct"; // Yashil
                  else if (selectedAnswer === option.id && !option.correct) classes += " wrong"; // Qizil
                }
                return (
                  <label key={option.id} className={classes}>
                    <input
                      type="radio"
                      name="answer"
                      value={option.id}
                      checked={selectedAnswer === option.id}
                      disabled={showCorrect}
                      onChange={() => handleAnswer(option)}
                    />
                    {option.body}
                  </label>
                );
              })}
            </div>
            <div className="score">Score: {score}</div>

            {currentQuestionIndex === questions.length - 1 && showCorrect && (
              <div className="end-buttons">
                <button className="btn" onClick={submitScore}>Submit Score</button>
                <button className="btn" onClick={handleTryAgain}>Try Again</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2>Test finished! Your final score: {score}</h2>
            <button className="btn" onClick={handleTryAgain}>Try Again</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
