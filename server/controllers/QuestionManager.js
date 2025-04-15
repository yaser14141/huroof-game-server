import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaLightbulb, FaQuestion } from 'react-icons/fa';
import { useGame } from '../context/GameContext';

const QuestionManager = () => {
  const { currentQuestion, setQuestion, answerQuestion } = useGame();
  
  const [questionForm, setQuestionForm] = useState({
    question: '',
    hint: '',
    answer: '',
    letter: '',
    points: 1
  });
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeTeam, setActiveTeam] = useState(1);
  
  // تحديث بيانات النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // تقديم السؤال
  const submitQuestion = () => {
    if (!questionForm.question || !questionForm.answer || !questionForm.letter) {
      // التحقق من إدخال البيانات المطلوبة
      alert('يرجى إدخال السؤال والإجابة والحرف');
      return;
    }
    
    // تعيين السؤال الحالي
    setQuestion({
      ...questionForm,
      teamNumber: activeTeam,
      timestamp: new Date().toISOString()
    });
  };
  
  // تسجيل إجابة صحيحة
  const markCorrect = () => {
    if (!selectedCell) {
      alert('يرجى اختيار خلية أولاً');
      return;
    }
    
    answerQuestion(true, activeTeam, 'player-id', selectedCell);
    resetForm();
  };
  
  // تسجيل إجابة خاطئة
  const markIncorrect = () => {
    answerQuestion(false, activeTeam, 'player-id', selectedCell);
    resetForm();
  };
  
  // إعادة تعيين النموذج
  const resetForm = () => {
    setQuestionForm({
      question: '',
      hint: '',
      answer: '',
      letter: '',
      points: 1
    });
    setSelectedCell(null);
  };
  
  // تبديل الفريق النشط
  const toggleActiveTeam = () => {
    setActiveTeam(prev => prev === 1 ? 2 : 1);
  };
  
  return (
    <QuestionManagerContainer>
      <ManagerHeader>
        <ManagerTitle>إدارة الأسئلة</ManagerTitle>
        <TeamToggle team={activeTeam} onClick={toggleActiveTeam}>
          {activeTeam === 1 ? 'الفريق الأول' : 'الفريق الثاني'}
        </TeamToggle>
      </ManagerHeader>
      
      <QuestionForm>
        <FormGroup>
          <FormLabel htmlFor="letter">
            <FaQuestion />
            <span>الحرف</span>
          </FormLabel>
          <LetterInput
            type="text"
            id="letter"
            name="letter"
            value={questionForm.letter}
            onChange={handleChange}
            maxLength={1}
            placeholder="أدخل الحرف..."
            dir="rtl"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="question">
            <FaQuestion />
            <span>السؤال</span>
          </FormLabel>
          <FormInput
            type="text"
            id="question"
            name="question"
            value={questionForm.question}
            onChange={handleChange}
            placeholder="أدخل السؤال..."
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="hint">
            <FaLightbulb />
            <span>التلميح (اختياري)</span>
          </FormLabel>
          <FormInput
            type="text"
            id="hint"
            name="hint"
            value={questionForm.hint}
            onChange={handleChange}
            placeholder="أدخل التلميح..."
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="answer">
            <FaCheck />
            <span>الإجابة</span>
          </FormLabel>
          <FormInput
            type="text"
            id="answer"
            name="answer"
            value={questionForm.answer}
            onChange={handleChange}
            placeholder="أدخل الإجابة الصحيحة..."
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="points">
            <span>النقاط</span>
          </FormLabel>
          <PointsSelect
            id="points"
            name="points"
            value={questionForm.points}
            onChange={handleChange}
          >
            <option value="1">1 نقطة</option>
            <option value="2">2 نقطة</option>
            <option value="3">3 نقاط</option>
          </PointsSelect>
        </FormGroup>
        
        <CellSelection>
          <FormLabel>الخلية المختارة</FormLabel>
          {selectedCell ? (
            <SelectedCellDisplay>
              {selectedCell}
            </SelectedCellDisplay>
          ) : (
            <NoCellMessage>
              لم يتم اختيار خلية بعد. انقر على خلية في اللوحة.
            </NoCellMessage>
          )}
        </CellSelection>
        
        <ButtonsGroup>
          <SubmitButton onClick={submitQuestion}>
            تقديم السؤال
          </SubmitButton>
          
          <ActionButtonsGroup>
            <CorrectButton onClick={markCorrect}>
              <FaCheck />
              <span>إجابة صحيحة</span>
            </CorrectButton>
            
            <IncorrectButton onClick={markIncorrect}>
              <FaTimes />
              <span>إجابة خاطئة</span>
            </IncorrectButton>
          </ActionButtonsGroup>
        </ButtonsGroup>
      </QuestionForm>
      
      {currentQuestion && (
        <CurrentQuestionDisplay>
          <CurrentQuestionHeader>
            السؤال الحالي
          </CurrentQuestionHeader>
          <CurrentQuestionContent>
            <QuestionText>
              <QuestionLabel>السؤال:</QuestionLabel>
              <span>{currentQuestion.question}</span>
            </QuestionText>
            
            {currentQuestion.hint && (
              <QuestionText>
                <QuestionLabel>التلميح:</QuestionLabel>
                <span>{currentQuestion.hint}</span>
              </QuestionText>
            )}
            
            <QuestionText>
              <QuestionLabel>الإجابة:</QuestionLabel>
              <span>{currentQuestion.answer}</span>
            </QuestionText>
            
            <QuestionText>
              <QuestionLabel>الفريق:</QuestionLabel>
              <span>{currentQuestion.teamNumber === 1 ? 'الفريق الأول' : 'الفريق الثاني'}</span>
            </QuestionText>
          </CurrentQuestionContent>
        </CurrentQuestionDisplay>
      )}
    </QuestionManagerContainer>
  );
};

const QuestionManagerContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const ManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
`;

const ManagerTitle = styled.h3`
  color: var(--primary-color);
  margin: 0;
  font-size: 1.2rem;
`;

const TeamToggle = styled.button`
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.team === 1 ? 'var(--team1-color)' : 'var(--team2-color)'};
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-speed);
  
  &:hover {
    opacity: 0.9;
  }
`;

const QuestionForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-color);
  font-weight: 600;
  
  svg {
    color: var(--primary-color);
  }
`;

const FormInput = styled.input`
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const LetterInput = styled(FormInput)`
  font-size: 1.5rem;
  text-align: center;
  width: 60px;
  font-weight: bold;
`;

const PointsSelect = styled.select`
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const CellSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const SelectedCellDisplay = styled.div`
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  text-align: center;
`;

const NoCellMessage = styled.div`
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color);
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
`;

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const SubmitButton = styled.button`
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: var(--button-primary);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const CorrectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--button-success);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  flex: 1;
  transition: all var(--transition-speed);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const IncorrectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--button-danger);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  flex: 1;
  transition: all var(--transition-speed);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const CurrentQuestionDisplay = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  margin-top: var(--spacing-sm);
`;

const CurrentQuestionHeader = styled.h4`
  color: var(--primary-color);
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1rem;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
`;

const CurrentQuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const QuestionText = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const QuestionLabel = styled.span`
  font-weight: 600;
  color: var(--text-secondary);
`;

export default QuestionManager;
