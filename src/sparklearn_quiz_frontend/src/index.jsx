
import { sparklearn_quiz_backend } from "../../declarations/sparklearn_quiz_backend";
import questions from "./questions"
import React, { useState, useEffect } from 'react'
import { createRoot } from "react-dom/client";
import Homepage from "./Components/Homepage";
import '../assets/main.scss'
import Leaderboard from "./Components/Leaderboard";
import Register from './Components/Register'
import Questions from './Components/Questions'
import CurrentScore from './Components/CurrentScore'
import FinalScore from './Components/FinalScore'
import Marquee from 'react-fast-marquee'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'


const App = () => {


  const [level, setLevel] = useState(0)
  const numQ = 5
  const [finalQuestionSet, setFinalQuestionSet] = useState({})
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [score, setScore] = useState(0)
  const [gameStart, setGameStart] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState()
  const [leaderboard, setLeaderboard] = useState([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerOn, setTimerOn] = useState(true)
  const [timerKey, setTimerKey] = useState(0)
  const [showAns, setShowAns] = useState(false)
  const [status, setStatus] = useState()
  const [btnStatus, setBtnStatus] = useState('')

  const fetchLeaderboard = async () => {
    let tempLead = []
    for(let i=0; i<10; i++) {
      tempLead.push(await sparklearn_quiz_backend.read(i))
    }
    setLeaderboard(tempLead.flat());
  }


  const testWrite = async (objectProps) => {
    console.log(await sparklearn_quiz_backend.create(objectProps));
  }

  function correct () {
    setTimerOn(false)
    setBtnStatus('btn-disabled')
    setTimeout(() => {
      setActiveQuestion(activeQuestion + 1)
      setScore(score + finalQuestionSet[activeQuestion].score)
      console.log(finalQuestionSet[activeQuestion].score)
    }, 2000)
  }

  function wrong () {
    setShowAns(true)
  }

  function UrgeWithPleasureComponent () {
    return (
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={timerOn}
        duration={timeLeft}
        initialRemainingTime={10}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        onComplete={() => {
          wrong()
          console.log('Wrong')
          setBtnStatus('btn-disabled')
          setTimeout(() => {
            setActiveQuestion(activeQuestion + 1)
          }, 2000)
        }}
      >
        {renderTime}
      </CountdownCircleTimer>
    )
  }

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className='timer'>Too late...</div>
    }

    return (
      <div className='timer'>
        <div className='text'>Remaining</div>
        <div className='value'>{remainingTime}</div>
        <div className='text'>seconds</div>
      </div>
    )
  }

  useEffect(() => {
    randomizer(numQ, questions[level], setFinalQuestionSet)
    fetchLeaderboard()
    setBtnStatus('')
  }, [])

  useEffect(() => {
    randomizer(numQ, questions[level], setFinalQuestionSet)
    setBtnStatus('')
  }, [level])

  useEffect(() => {
    if (activeQuestion >= numQ && level !== 2) {
      setLevel(level + 1)
      setActiveQuestion(0)
      randomizer(numQ, questions[level], setFinalQuestionSet)
    } else if (activeQuestion >= numQ && level === 2) {
      // fetch('/api/save', {
      //   method: 'POST',
      //   body: JSON.stringify({ nickname, email, score })
      // })
      let name = nickname
      testWrite({ name, email, score })

      console.log('Finished')

      randomizer(numQ, questions[level], setFinalQuestionSet)
      setGameFinished(true)
    }
    setShowAns(false)
    setTimerKey(timerKey + 1)
    setTimerOn(true)
    setStatus()
    setBtnStatus('')
  }, [activeQuestion])

  const resetHandler = () => {
    setGameStart(false)
    setGameFinished(false)
    setNickname('')
    setEmail('')
    setScore(0)
    setActiveQuestion(0)
    fetchLeaderboard()
    window.location.reload()
  }

  const handleGameStatus = () => {
    setGameStart(true)
  }

  const randomizer = (numItems, items, setter) => {
    let itemSet = []

    const baseIndex = Math.floor(Math.random() * items?.length)

    let j = baseIndex

    let k = 0

    for (let i = 0; i < numItems; i++) {
      if (i + j > items?.length - 1) {
        itemSet[i] = items[k++]
      } else {
        itemSet[i] = items[i + j]
      }
    }

    for (let k = 0; k < 1000; k++) {
      let randNum = Math.floor(Math.random() * itemSet.length)

      let temp = itemSet[0]

      itemSet[0] = itemSet[randNum]
      itemSet[randNum] = temp
    }
    setter(itemSet)
  }

  return (
    <>
      <div className='d-flex j-content-center'>
        <div style={{ position: 'absolute', top: '20px', color: 'white' }}>
          <img
            src='/white_wLogo.png'
            alt='Logo'
            height={45}
            width={200}
          />
          <h1 className='text-center title-text' style={{ margin: 0 }}>
            BlockQuiz
          </h1>
        </div>
      </div>
      <div className="container">
        <main>
          <Leaderboard topPlayers={leaderboard} />
          {!gameStart && !gameFinished ? (
            <Register
              nickname={nickname}
              email={email}
              handleGameStatus={handleGameStatus}
              setEmail={setEmail}
              setNickname={setNickname}
            />
          ) : !gameFinished ? (
            <>
              <CurrentScore nickname={nickname} score={score} />
              <Questions
                numQuestions={numQ}
                currentQuestion={finalQuestionSet[activeQuestion]}
                activeQuestion={activeQuestion}
                setActiveQuestion={setActiveQuestion}
                setScore={setScore}
                score={score}
                wrong={wrong}
                timer={UrgeWithPleasureComponent}
                correct={correct}
                correctAnswer={correctAnswer}
                setCorrectAnswer={setCorrectAnswer}
                showAns={showAns}
                setStatus={setStatus}
                status={status}
                randomizer={randomizer}
                setTimerOn={setTimerOn}
                btnStatus={btnStatus}
                level={level}
                setBtnStatus={setBtnStatus}
              />
            </>
          ) : (
            <FinalScore
              finalScore={score}
              nickname={nickname}
              resetHandler={resetHandler}
            />
          )}
          <div className='d-flex j-content-center'>
            <Marquee
              style={{
                position: 'absolute',
                bottom: '40px',
                backgroundColor: '#ffffff',
                color: '#2c6484'
              }}
            >
              <h1>
                | 100% Decentralized | React | Motoko | Internet Computer | DFinity
                | 100% Decentralized | React | Motoko | Internet Computer | DFinity
                | 100% Decentralized | React | Motoko | Internet Computer | DFinity
              </h1>
            </Marquee>
          </div>
        </main>
      </div>
    </>
  )
}


const container = document.getElementById('app')
const root = createRoot(container)

root.render(<App />)
