import { useEffect, useState } from 'react'
import { ShuffleArray } from '../Util'
import '../styles/Question.css'
import Answer from './Answer'

export default function Question(props) {
    const [answers, setAnswers] = useState(getAnswersObj())
    const [indexSelected, setIndexSelected] = useState(null)

    useEffect(() => {
        setAnswers(oldAnswer => {
            return oldAnswer.map((answer, index) => {
                return {
                    index: index,
                    answer: answer.answer,
                    isCorrect: answer.isCorrect,
                    isSelected: index === indexSelected
                }
            })
        })
    }, [indexSelected])

    function getAnswersObj() {
        const answers = []
        let index = 0

        props.incorrectAnswers.forEach((answer) => {
            answers.push({
                index: index,
                answer: answer,
                isCorrect: false,
                isSelected: false
            })

            index++
        });

        answers.push({
            index: index,
            answer: props.correctAnswer,
            isCorrect: true,
            isSelected: false
        })

        ShuffleArray(answers)

        return answers
    }

    function getAnswersElements() {
        return answers.map((answer, index) => {
            return <Answer key={index} questionIndex={props.index} index={index} answer={answer.answer} isCorrect={answer.isCorrect} isSelected={answer.isSelected} selectAnswer={setIndexSelected} isChecked={props.isChecked} handleAnswerClick={props.handleAnswerClick} />
        });
    }

    return (
        <div className='question-container'>
            <h3 className='question'>
                {props.question}
            </h3>
            <div className='answers'>
                {getAnswersElements()}
            </div>
            <span className='line'></span>
        </div>
    )
}