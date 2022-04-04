import '../styles/Answer.css'

export default function Answer(props) {
    const classes = `answer ${props.isCorrect ? 'correct' : 'incorrect'} ${props.isSelected && 'selected'} ${props.isChecked && 'checked'}`

    function handleClick() {
        if (!props.isChecked) {
            props.handleAnswerClick(props.questionIndex, props.isCorrect)
            props.selectAnswer(props.index)
        }
    }

    return (
        <div className={classes} onClick={handleClick} >{props.answer}</div>
    )
}