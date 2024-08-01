'use client'
import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Editor from '../IDE/Editor';
import MarkdownRenderer from '../Markdown/MarkdownRenderer';
import config from '@/config';
import { shuffle } from 'lodash';

interface Question {
  correct_index: number;
  options: string[];
  question: string;
  type: number;
  matching_pairs?: { left: string, right: string }[];
}

interface QuizPageProps {
  data: {
    _id: string;
    color: string;
    questions: Question[];
    name: string;
    description: string;
  };
}

function RenderQuizPage({ data }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(data.questions.length).fill(null));
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(data.questions.length).fill(false));
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [wrongAnswerIndex, setWrongAnswerIndex] = useState<number | null>(null);
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<{[key: number]: {[key: string]: string}}>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const currentQuestion = data.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

  const handleAnswerClick = (index: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newSelectedAnswers);
    setIsWrongAnswer(false);
  };

  const handleNextQuestion = () => {
    const currentAnswer = selectedAnswers[currentQuestionIndex];
    if (currentAnswer === currentQuestion.correct_index || currentQuestion.type === 1) {
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsWrongAnswer(false);
      setWrongAnswerIndex(null);
    } else {
      setIsWrongAnswer(true);
      setWrongAnswerIndex(currentAnswer);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    setIsWrongAnswer(false);
  };

  const setQuizComplete = async (quizId: string) => {
    try {
      const response = await fetch(`${config.rootPath}/api/quiz/setAttemptComplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            quiz_id: quizId,
            // quiz_answers: []
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.message === 'quiz attempt marked as complete') {
        window.location.href = `/journey`;
      }
    } catch (error) {
      console.error("Error: An error occurred while marking quiz complete", error);
    }
  };

  const handleSubmit = () => {
    if (
      (currentQuestion.type !== 1 && selectedAnswers[currentQuestionIndex] === currentQuestion.correct_index) ||
      (currentQuestion.type === 1 && Object.keys(matchedPairs[currentQuestionIndex] || {}).length === currentQuestion.matching_pairs?.length)
    ) {
      setQuizComplete(data._id);
    } else {
      setIsWrongAnswer(true);
    }
  };

  const matchingQuestion = () => {
    const currentPairs = currentQuestion.matching_pairs || [];
    const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
    const [pairColors, setPairColors] = useState<{[key: string]: string}>({});

    const colors = ['#3498db', '#2ecc71', '#f1c40f', '#fff']; // blue, green, yellow, white

    console.log("matched:", matchedPairs);
    React.useEffect(() => {
      setLeftItems(shuffle(currentPairs.map(pair => pair.left)));
      setRightItems(shuffle(currentPairs.map(pair => pair.right)));
      setSelectedLeft(null);
      setWrongPair(null);

      // Assign colors to pairs
      const newPairColors: {[key: string]: string} = {};
      currentPairs.forEach((pair, index) => {
        const color = colors[index % colors.length];
        newPairColors[pair.left] = color;
        newPairColors[pair.right] = color;
      });
      setPairColors(newPairColors);
    }, [currentQuestionIndex]);

    const handleLeftClick = (item: string) => {
      setSelectedLeft(item);
    };

    const handleRightClick = (item: string) => {
      if (selectedLeft) {
        const correctPair = currentPairs.find(pair => pair.left === selectedLeft && pair.right === item);
        if (correctPair) {
          setMatchedPairs(prev => ({
            ...prev,
            [currentQuestionIndex]: { ...prev[currentQuestionIndex], [selectedLeft]: item }
          }));
        } else {
          setWrongPair([selectedLeft, item]);
          setTimeout(() => setWrongPair(null), 500);
        }
        setSelectedLeft(null);
      }
    };

    const getItemColor = (item: string): string => {
      return pairColors[item] || '#ffffff'; // default to white if no color assigned
    };

    return (
      <>
        {/* Explanation Text */}
        <Box sx={{ width: '50%', height: '250px', border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <MarkdownRenderer
            markdown={currentQuestion.question}
            style={{
              margin: "20px",
              fontSize: "1.2rem",
              width: "100%",
              lineHeight: "1.8",
            }}
          />
        </Box>

        {/* Matching Game */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '75%', gap: 2 }}>
          {/* Left Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '200px', maxWidth: '400px' }}>
            {leftItems.map((item, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleLeftClick(item)}
                disabled={item in (matchedPairs[currentQuestionIndex] || {})}
                sx={{
                  width: '100%',
                  height: '70px',
                  fontSize: '0.9rem',
                  backgroundColor: selectedLeft === item ? 'primary.dark' : 'primary.main',
                  '&:disabled': { 
                    backgroundColor: `${getItemColor(item)}22`,
                    color: getItemColor(item),
                    border: `2px solid ${getItemColor(item)}`,
                    opacity: 0.3
                  },
                  ...(wrongPair && wrongPair[0] === item ? { 
                    backgroundColor: 'red !important',
                    '&:hover': {
                      backgroundColor: 'red !important',
                    }
                  } : {}),
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Right Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '200px', maxWidth: '400px' }}>
            {rightItems.map((item, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleRightClick(item)}
                disabled={Object.values(matchedPairs[currentQuestionIndex] || {}).includes(item)}
                sx={{
                  width: '100%',
                  height: '70px',
                  fontSize: '0.9rem',
                  backgroundColor: 'primary.main',
                  '&:disabled': { 
                    backgroundColor: `${getItemColor(item)}22`, 
                    color: getItemColor(item),
                    border: `2px solid ${getItemColor(item)}`,
                    opacity: 0.3
                  },
                  ...(wrongPair && wrongPair[1] === item ? { 
                    backgroundColor: 'red !important',
                    '&:hover': {
                      backgroundColor: 'red !important',
                    }
                  } : {}),
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Box>
      </>
    );
  };

  const renderQuestion = () => {
    return (
      <Box
        sx={{
          backgroundImage: `linear-gradient(to bottom, ${data.color} -30%, transparent 20%)`,
          padding: 3,
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%' }}>
          <Typography variant="h4" component="h1" sx={{ mt: 3 }}>
            {data.name}
          </Typography>

          {/* Progress bar and question count */}
          <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 10, borderRadius: 5 }}>
              <Box
                sx={{
                  width: `${((currentQuestionIndex) / data.questions.length) * 100}%`,
                  bgcolor: 'primary.main',
                  height: 10,
                  borderRadius: 5,
                  transition: 'width 0.3s ease-in-out',
                }}
              />
            </Box>
            <Typography variant="body2">
              {currentQuestionIndex} / {data.questions.length}
            </Typography>
          </Box>

          {/* Code Type Question */}
          {currentQuestion.type === 0 && (
            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: '100%', height: '250px', border: '1px solid #ccc' }}>
                  <Editor
                    language="python"
                    code={currentQuestion.question}
                    readonly={true}
                    theme="dark"
                    wrapperStyles={{
                      width: '100%',
                      height: '245px',
                      borderRadius: "10px",
                    }}
                  />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                {currentQuestion.options.map((answer, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: '90px',
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedAnswers[currentQuestionIndex] === index
                          ? (isWrongAnswer && (isLastQuestion || index === wrongAnswerIndex) ? 'red' : (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : '#2b2b29')
                          : (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : 'transparent',
                    }}
                    onClick={() => handleAnswerClick(index)}
                  >
                    <Typography>{answer}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Matching Type Question */}
          {currentQuestion.type === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {matchingQuestion()}
            </Box>
          )}

          {/* Text Type Question */}
          {currentQuestion.type === 2 && (
            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: '100%', height: '250px', border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MarkdownRenderer
                  markdown={currentQuestion.question}
                  style={{
                    margin: "20px",
                    fontSize: "1.2rem",
                    width: "fit-content",
                    lineHeight: "1.8", 
                  }}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                {currentQuestion.options.map((answer, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: '100px',
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedAnswers[currentQuestionIndex] === index
                          ? (isWrongAnswer && (isLastQuestion || index === wrongAnswerIndex) ? 'red' : (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : '#2b2b29')
                          : (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : 'transparent',
                    }}
                    onClick={() => handleAnswerClick(index)}
                  >
                    <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center' }}>{answer}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              sx={{ width: '150px' }}
            >
              Previous
            </Button>
            {!isLastQuestion && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                disabled={currentQuestion.type === 1 && Object.keys(matchedPairs[currentQuestionIndex] || {}).length !== currentQuestion.matching_pairs?.length}
                sx={{ width: '150px' }}
              >
                Next
              </Button>
            )}
            {isLastQuestion && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ width: '150px' }}
              >
                Submit
              </Button>
            )}
          </Box>
          {isWrongAnswer && isLastQuestion && (
            <Typography color="error">Your answer is incorrect. Please try again.</Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {renderQuestion()}
    </Box>
  );
}

export default RenderQuizPage;