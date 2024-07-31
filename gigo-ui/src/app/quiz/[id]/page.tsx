'use client'
import React, { useEffect, useState } from 'react';
import RenderQuizPage from '@/components/Bytes/intro';
import config from '@/config';

export default function QuizPage({ params }: { params: { id: string } }) {
  const quizId = params.id;

  const [quizData, setQuizData] = useState<any>(null);

  const startQuizAttempt = async (quizId: string) => {
    try {
      const response = await fetch(`${config.rootPath}/api/quiz/startAttempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizId }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log("Response:", data);
      
    } catch (error) {
      console.error("Error: An error occurred while starting the byte attempt.", error);
    }
  };

  const getQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`${config.rootPath}/api/quiz/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizId }),
        credentials: 'include'
      });

      const data = await response.json();
      setQuizData(data.quiz)
    } catch (error) {
      console.error("Error: An error occurred while starting the byte attempt.", error);
    }
  };

    useEffect(() => {
        startQuizAttempt(quizId)
        getQuiz(quizId)
    }, [])

    

  return (
    quizData && (
        <RenderQuizPage
            data={quizData}
        />
    )
  );
}
