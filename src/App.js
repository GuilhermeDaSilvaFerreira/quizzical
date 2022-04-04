import { useEffect, useState } from 'react'
import { DecodeFromBase64 } from './Util'
import './App.css';
import Question from './componentes/Question';

function App() {
  const [quizzStarted, setQuizzStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([false, false, false, false, false])
  const [correctAnswers, setCorrectAnswers] = useState([0, 0, 0, 0, 0])
  const [fetchController, setFetchController] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple&encode=base64")

        if (response.ok) {
          const data = await response.json()

          const decodedData = data.results.map(question => {
            return {
              category: DecodeFromBase64(question.category),
              type: DecodeFromBase64(question.type),
              difficulty: DecodeFromBase64(question.difficulty),
              question: DecodeFromBase64(question.question),
              correctAnswer: DecodeFromBase64(question.correct_answer),
              incorrectAnswers: question.incorrect_answers.map(answer => DecodeFromBase64(answer))
            }
          })

          setQuestions(decodedData)
        } else {
          console.log(`Error fetching the answers: ${response.status} - ${response.statusText}`)
        }
      } catch (error) {
        console.log(`Error fetching the answers. Error: ${error}`)
      }
    }

    fetchData()
  }, [fetchController])

  function getStartScreen() {
    return (
      <div className='start-container'>
        <h1>
          Quizzical
        </h1>
        <h2>
          Are you smart enough to get all the questions right?
        </h2>
        <button className='start-button' onClick={() => { setQuizzStarted(true) }}>Start Quizz</button>
      </div>
    )
  }

  function handleAnswerClick(index, isCorrectAnswer) {
    if (isCorrectAnswer) {
      setCorrectAnswers(oldAnswers => {
        return oldAnswers.map((number, ind) => {
          return index === ind ? 1 : number
        })
      })
    } else {
      setCorrectAnswers(oldAnswers => {
        return oldAnswers.map((number, ind) => {
          return index === ind ? 0 : number
        })
      })
    }

    setAnsweredQuestions(oldAnswers => {
      return oldAnswers.map((question, ind) => {
        return index === ind ? true : question
      })
    })
  }

  function getNumberOfCorrectAnswer() {
    let total = 0
    correctAnswers.forEach(number => {
      total += number
    });

    return total
  }

  function allQuestionsAnswered(){
    return answeredQuestions.every(question => question)
  }

  function handleClick() {
    if(!isChecked && allQuestionsAnswered()) {
      setIsChecked(true)
    } else if(isChecked) {
      setQuestions([])
      setAnsweredQuestions([false, false, false, false, false])
      setCorrectAnswers([0, 0, 0, 0, 0])
      setIsChecked(false)
      setFetchController(oldValue => !oldValue)
    }
  }

  function getQuizzElements() {
    const questionElements = questions.map((question, index) => {
      return <Question key={index} index={index} question={question.question} incorrectAnswers={question.incorrectAnswers} correctAnswer={question.correctAnswer} isChecked={isChecked} handleAnswerClick={handleAnswerClick} />
    })

    return (
      <div className='questions-container'>
        <div className='questions'>
          {questionElements}
        </div>
        <div className='score-container'>
          {isChecked && <h3 className='score'>You scored {getNumberOfCorrectAnswer()}/5 correct answers</h3>}
          <button className={`check-answers-button ${!allQuestionsAnswered() && 'pending'}`} onClick={handleClick}>
            {isChecked ? 'Play again' : 'Check answers'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='App'>
      <div className={`circle-one ${!quizzStarted && 'start'}`}></div>
      {quizzStarted ? getQuizzElements() : getStartScreen()}
      <div className={`circle-two ${!quizzStarted && 'start'}`}></div>
    </div>
  );
}

export default App;
