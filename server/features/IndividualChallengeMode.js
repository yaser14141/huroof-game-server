import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaRedo, FaClock, FaTrophy, FaMedal, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import SquareCell from '../game/SquareCell';

const IndividualChallengeMode = () => {
  const { username, userId } = useUser();
  const { theme } = useTheme();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLetter, setCurrentLetter] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameOver, setGameOver] = useState(false);
  
  // قائمة الحروف العربية
  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
  
  // قائمة الأسئلة حسب الحروف
  const questionsByLetter = {
    'أ': [
      'اسم حيوان يبدأ بحرف الألف',
      'اسم دولة تبدأ بحرف الألف',
      'اسم فاكهة تبدأ بحرف الألف'
    ],
    'ب': [
      'اسم طائر يبدأ بحرف الباء',
      'اسم مدينة تبدأ بحرف الباء',
      'اسم نبات يبدأ بحرف الباء'
    ],
    'ت': [
      'اسم من أسماء الله الحسنى يبدأ بحرف التاء',
      'اسم بلد يبدأ بحرف التاء',
      'اسم فاكهة تبدأ بحرف التاء'
    ],
    // وهكذا لباقي الحروف...
  };
  
  // بدء اللعبة
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setGameHistory([]);
    setGameOver(false);
    generateNewQuestion();
  };
  
  // توليد سؤال جديد
  const generateNewQuestion = () => {
    // اختيار حرف عشوائي
    const randomLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    setCurrentLetter(randomLetter);
    
    // اختيار سؤال عشوائي للحرف
    let questions = questionsByLetter[randomLetter];
    if (!questions) {
      // إذا لم تكن هناك أسئلة محددة لهذا الحرف، استخدم أسئلة عامة
      questions = [
        `اسم حيوان يبدأ بحرف ${randomLetter}`,
        `اسم بلد يبدأ بحرف ${randomLetter}`,
        `اسم نبات يبدأ بحرف ${randomLetter}`
      ];
    }
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    
    // إعادة ضبط الإجابة والوقت
    setUserAnswer('');
    setTimeLeft(getDifficultyTime());
  };
  
  // الحصول على الوقت حسب مستوى الصعوبة
  const getDifficultyTime = () => {
    switch (difficulty) {
      case 'easy':
        return 45;
      case 'medium':
        return 30;
      case 'hard':
        return 20;
      default:
        return 30;
    }
  };
  
  // تغيير مستوى الصعوبة
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };
  
  // التحقق من الإجابة
  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    // التحقق من أن الإجابة تبدأ بالحرف الصحيح
    const isCorrect = userAnswer.trim().charAt(0) === currentLetter;
    
    // إضافة النتيجة إلى سجل اللعبة
    const result = {
      letter: currentLetter,
      question: currentQuestion,
      answer: userAnswer,
      isCorrect,
      timeSpent: getDifficultyTime() - timeLeft
    };
    
    setGameHistory(prev => [result, ...prev]);
    
    // تحديث النقاط والتتابع
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 5);
      const newStreak = streak + 1;
      const streakBonus = Math.floor(newStreak / 3) * 10;
      
      setScore(prev => prev + 10 + timeBonus + streakBonus);
      setStreak(newStreak);
    } else {
      setStreak(0);
    }
    
    // توليد سؤال جديد
    generateNewQuestion();
  };
  
  // العد التنازلي للوقت
  useEffect(() => {
    let timer;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // انتهاء الوقت
      const result = {
        letter: currentLetter,
        question: currentQuestion,
        answer: userAnswer || 'لم يتم الإجابة',
        isCorrect: false,
        timeSpent: getDifficultyTime()
      };
      
      setGameHistory(prev => [result, ...prev]);
      setStreak(0);
      
      // التحقق مما إذا كانت اللعبة قد انتهت
      if (gameHistory.length >= 9) {
        setGameOver(true);
        setIsPlaying(false);
      } else {
        generateNewQuestion();
      }
    }
    
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);
  
  // معالجة الإدخال
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };
  
  // إرسال الإجابة عند الضغط على Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };
  
  return (
    <ChallengeContainer>
      <ChallengeHeader>
        <ChallengeTitle>وضع التحدي الفردي</ChallengeTitle>
        <BackButton>
          <FaArrowLeft />
          <span>العودة للقائمة الرئيسية</span>
        </BackButton>
      </ChallengeHeader>
      
      {!isPlaying && !gameOver ? (
        <StartScreen>
          <WelcomeMessage>
            <h2>مرحباً بك في وضع التحدي الفردي!</h2>
            <p>اختبر معلوماتك وسرعة بديهتك في الإجابة على الأسئلة التي تبدأ بحروف مختلفة.</p>
          </WelcomeMessage>
          
          <DifficultySelector>
            <DifficultyTitle>اختر مستوى الصعوبة:</DifficultyTitle>
            <DifficultyOptions>
              <DifficultyButton 
                active={difficulty === 'easy'} 
                onClick={() => changeDifficulty('easy')}
              >
                سهل (45 ثانية)
              </DifficultyButton>
              
              <DifficultyButton 
                active={difficulty === 'medium'} 
                onClick={() => changeDifficulty('medium')}
              >
                متوسط (30 ثانية)
              </DifficultyButton>
              
              <DifficultyButton 
                active={difficulty === 'hard'} 
                onClick={() => changeDifficulty('hard')}
              >
                صعب (20 ثانية)
              </DifficultyButton>
            </DifficultyOptions>
          </DifficultySelector>
          
          <StartButton onClick={startGame}>
            <FaPlay />
            <span>ابدأ اللعب</span>
          </StartButton>
          
          <GameRules>
            <h3>قواعد اللعبة:</h3>
            <ul>
              <li>سيتم عرض حرف وسؤال يتعلق به.</li>
              <li>يجب عليك الإجابة بكلمة تبدأ بنفس الحرف.</li>
              <li>لديك وقت محدود للإجابة على كل سؤال.</li>
              <li>تحصل على نقاط إضافية للإجابات السريعة والإجابات المتتالية الصحيحة.</li>
            </ul>
          </GameRules>
        </StartScreen>
      ) : gameOver ? (
        <GameOverScreen>
          <GameOverTitle>انتهت اللعبة!</GameOverTitle>
          
          <FinalScore>
            <FaTrophy />
            <span>النتيجة النهائية: {score}</span>
          </FinalScore>
          
          <GameStats>
            <StatItem>
              <StatLabel>عدد الأسئلة:</StatLabel>
              <StatValue>{gameHistory.length}</StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>الإجابات الصحيحة:</StatLabel>
              <StatValue>{gameHistory.filter(item => item.isCorrect).length}</StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>نسبة النجاح:</StatLabel>
              <StatValue>
                {gameHistory.length > 0 
                  ? `${Math.round((gameHistory.filter(item => item.isCorrect).length / gameHistory.length) * 100)}%` 
                  : '0%'}
              </StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>أطول تتابع صحيح:</StatLabel>
              <StatValue>{calculateLongestStreak(gameHistory)}</StatValue>
            </StatItem>
          </GameStats>
          
          <GameHistorySection>
            <HistoryTitle>سجل الإجابات</HistoryTitle>
            <HistoryList>
              {gameHistory.map((item, index) => (
                <HistoryItem key={index} isCorrect={item.isCorrect}>
                  <HistoryQuestion>
                    <HistoryLetter>{item.letter}</HistoryLetter>
                    <span>{item.question}</span>
                  </HistoryQuestion>
                  <HistoryAnswer>
                    <span>إجابتك: {item.answer}</span>
                    <HistoryTime>{item.timeSpent} ثانية</HistoryTime>
                  </HistoryAnswer>
                </HistoryItem>
              ))}
            </HistoryList>
          </GameHistorySection>
          
          <PlayAgainButton onClick={startGame}>
            <FaRedo />
            <span>العب مرة أخرى</span>
          </PlayAgainButton>
        </GameOverScreen>
      ) : (
        <GameplayScreen>
          <GameInfo>
            <ScoreDisplay>
              <FaMedal />
              <span>النقاط: {score}</span>
            </ScoreDisplay>
            
            <StreakDisplay streak={streak}>
              <span>التتابع: {streak}</span>
              {streak >= 3 && <StreakBadge>🔥</StreakBadge>}
            </StreakDisplay>
            
            <TimerDisplay timeLeft={timeLeft} totalTime={getDifficultyTime()}>
              <FaClock />
              <span>{timeLeft}</span>
            </TimerDisplay>
          </GameInfo>
          
          <LetterDisplay>
            <SquareCell letter={currentLetter} />
          </LetterDisplay>
          
          <QuestionDisplay>
            <FaQuestionCircle />
            <QuestionText>{currentQuestion}</QuestionText>
          </QuestionDisplay>
          
          <AnswerInput
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="اكتب إجابتك هنا..."
            autoFocus
          />
          
          <SubmitButton onClick={checkAnswer}>
            تأكيد الإجابة
          </SubmitButton>
          
          <GameHistoryMini>
            {gameHistory.slice(0, 3).map((item, index) => (
              <HistoryItemMini key={index} isCorrect={item.isCorrect}>
                <HistoryLetterMini>{item.letter}</HistoryLetterMini>
                <HistoryAnswerMini>{item.answer}</HistoryAnswerMini>
                <HistoryResultMini isCorrect={item.isCorrect}>
                  {item.isCorrect ? '✓' : '✗'}
                </HistoryResultMini>
              </HistoryItemMini>
            ))}
          </GameHistoryMini>
        </GameplayScreen>
      )}
    </ChallengeContainer>
  );
};

// حساب أطول تتابع صحيح
const calculateLongestStreak = (history) => {
  let currentStreak = 0;
  let maxStreak = 0;
  
  // يجب عكس المصفوفة لأن الإجابات الأحدث في البداية
  const reversedHistory = [...history].reverse();
  
  for (const item of reversedHistory) {
    if (item.isCorrect) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
};

const ChallengeContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
  max-width: 800px;
  margin: 0 auto;
`;

const ChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const ChallengeTitle = styled.h2`
  margin: 0;
  color: var(--primary-color);
  font-size: 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-color);
  cursor: pointer;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const StartScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
  padding: var(--spacing-xl) 0;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    max-width: 600px;
    line-height: 1.6;
  }
`;

const DifficultySelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 600px;
`;

const DifficultyTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
  text-align: center;
`;

const DifficultyOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const DifficultyButton = styled.button`
  padding: var(--spacing-md);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-speed);
  min-width: 150px;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  }
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--button-success);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all var(--transition-speed);
  margin-top: var(--spacing-md);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const GameRules = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  width: 100%;
  max-width: 600px;
  
  h3 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
  }
  
  ul {
    padding-right: var(--spacing-lg);
    margin: 0;
    
    li {
      margin-bottom: var(--spacing-xs);
      color: var(--text-secondary);
    }
  }
`;

const GameplayScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md) 0;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--spacing-md);
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-color);
  
  svg {
    color: gold;
  }
`;

const StreakDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: ${props => props.streak >= 3 ? 'var(--button-warning)' : 'var(--text-color)'};
  position: relative;
`;

const StreakBadge = styled.div`
  font-size: 1.2rem;
`;

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: ${props => {
    if (props.timeLeft < props.totalTime * 0.2) return 'var(--button-danger)';
    if (props.timeLeft < props.totalTime * 0.5) return 'var(--button-warning)';
    return 'var(--button-success)';
  }};
  
  svg {
    animation: ${props => props.timeLeft < 5 ? 'pulse 1s infinite' : 'none'};
  }
  

(Content truncated due to size limit. Use line ranges to read in chunks)