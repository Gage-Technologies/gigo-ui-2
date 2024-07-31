'use client'
import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Editor from '../IDE/Editor';
import MarkdownRenderer from '../Markdown/MarkdownRenderer';

interface Question {
  correct_index: number;
  options: string[];
  question: string;
  type: number;
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
    if (currentAnswer === currentQuestion.correct_index) {
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

  const handleSubmit = () => {
    if (selectedAnswers[currentQuestionIndex] === currentQuestion.correct_index) {
      console.log('Quiz submitted');
    } else {
      setIsWrongAnswer(true);
    }
  };

  const matchingQuestion = () => {
    const [matches, setMatches] = useState<{ [key: string]: string | null }>({});
    const [incorrect, setIncorrect] = useState<{ left: string | null, right: string | null }>({ left: null, right: null });
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

    const leftItems = ['Variable', 'List', 'Dictionary'];
    const rightItems = ['Ordered, mutable collection', 'Key-value pairs', 'Named container for data'];

    const correctMatches: { [key: string]: string } = {
        'Variable': 'Named container for data',
        'List': 'Ordered, mutable collection',
        'Dictionary': 'Key-value pairs'
    };

    const handleMatch = (left: string, right: string) => {
        if (correctMatches[left] === right) {
            setMatches({ ...matches, [left]: right });
            setSelectedLeft(null);
        } else {
            setIncorrect({ left, right });
            setTimeout(() => setIncorrect({ left: null, right: null }), 8000);
        }
    };

    const handleReset = () => {
        setMatches({});
        setIncorrect({ left: null, right: null });
        setSelectedLeft(null);
    };

    return (
        <>
            {/* Explanation Text */}
            <Box sx={{ width: '75%', padding: 3, border: '1px solid #ccc', borderRadius: '10px' }}>
                <Typography variant="body1" paragraph>
                    In Python, a variable is a named container for data, a list is an ordered, mutable collection, and a dictionary stores key-value pairs.
                </Typography>
                <Typography variant="body1">
                    Match each Python concept on the left with its correct description on the right.
                </Typography>
            </Box>

            {/* Matching Game */}
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '75%', gap: 2 }}>
                {/* Left Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {leftItems.map((item) => (
                        <Box
                            key={item}
                            sx={{
                                width: '200px',
                                height: '50px',
                                border: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: incorrect.left === item ? 'red' : (matches[item] ? 'green' : (selectedLeft === item ? '#2b2b29' : 'transparent')),
                                opacity: matches[item] ? 0 : 1,
                                transition: 'all 0.3s ease',
                            }}
                            onClick={() => setSelectedLeft(item)}
                        >
                            <Typography>{item}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Right Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {rightItems.map((item) => (
                        <Box
                            key={item}
                            sx={{
                                width: '300px',
                                height: '50px',
                                border: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: incorrect.right === item ? 'red' : (Object.values(matches).includes(item) ? 'green' : 'transparent'),
                                opacity: Object.values(matches).includes(item) ? 0 : 1,
                                transition: 'all 0.3s ease',
                            }}
                            onClick={() => {
                                if (selectedLeft) {
                                    handleMatch(selectedLeft, item);
                                }
                            }}
                        >
                            <Typography>{item}</Typography>
                        </Box>
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
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mt: 3 }}>
            {data.name}
          </Typography>

          {/* Progress bar and question count */}
          <Box sx={{ width: '75%', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 10, borderRadius: 5 }}>
              <Box
                sx={{
                  width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%`,
                  bgcolor: 'primary.main',
                  height: 10,
                  borderRadius: 5,
                  transition: 'width 0.3s ease-in-out',
                }}
              />
            </Box>
            <Typography variant="body2">
              {currentQuestionIndex + 1} / {data.questions.length}
            </Typography>
          </Box>

          {/* Code Type Question */}
          {currentQuestion.type === 2 && (
            <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ height: '100%', border: '1px solid #ccc' }}>
                <MarkdownRenderer
                    markdown={currentQuestion.question}
                    style={{
                        margin: "10px",
                        fontSize: "1rem",
                        width: "fit-content",
                    
                    }}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {currentQuestion.options.map((answer, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: '80px',
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: 
                        selectedAnswers[currentQuestionIndex] === index
                          ? (isWrongAnswer && (isLastQuestion || index === wrongAnswerIndex) ? 'red' : 
                             (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : 
                             '#2b2b29')
                          : (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : 
                            'transparent',
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
            <Typography>Matching question implementation</Typography>
          )}

          {/* Text Type Question */}
          {currentQuestion.type === 3 && (
            <>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                {currentQuestion.question}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {currentQuestion.options.map((answer, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '500px',
                      height: '80px',
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: 
                        selectedAnswers[currentQuestionIndex] === index
                          ? (isWrongAnswer && (isLastQuestion || index === wrongAnswerIndex) ? 'red' : 
                             (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : 
                             '#2b2b29')
                          : (answeredQuestions[currentQuestionIndex] && index === currentQuestion.correct_index) ? 'green' : 
                            'transparent',
                    }}
                    onClick={() => handleAnswerClick(index)}
                  >
                    <Typography>{answer}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentQuestionIndex > 0 && (
              <Button variant="contained" color="secondary" onClick={handlePreviousQuestion}>
                Previous
              </Button>
            )}
            {!isLastQuestion ? (
              <Button variant="contained" color="primary" onClick={handleNextQuestion}>
                Next
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
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