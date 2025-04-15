import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar, FaRegStar, FaSmile, FaMeh, FaFrown, FaComment, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const PlayerFeedbackSystem = ({ onClose }) => {
  const { theme } = useTheme();
  const { username } = useUser();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // قائمة الأسئلة للتقييم
  const feedbackQuestions = [
    {
      id: 'gameplay',
      question: 'ما رأيك في طريقة اللعب؟',
      options: ['ممتازة', 'جيدة', 'متوسطة', 'تحتاج تحسين']
    },
    {
      id: 'difficulty',
      question: 'ما رأيك في مستوى صعوبة اللعبة؟',
      options: ['سهلة جداً', 'مناسبة', 'صعبة قليلاً', 'صعبة جداً']
    },
    {
      id: 'ui',
      question: 'ما رأيك في واجهة المستخدم؟',
      options: ['ممتازة', 'جيدة', 'متوسطة', 'تحتاج تحسين']
    }
  ];
  
  const [questionAnswers, setQuestionAnswers] = useState({
    gameplay: '',
    difficulty: '',
    ui: ''
  });
  
  // تعيين التقييم
  const handleRating = (value) => {
    setRating(value);
  };
  
  // تعيين مستوى الرضا
  const handleSatisfaction = (value) => {
    setSatisfaction(value);
  };
  
  // تغيير إجابة السؤال
  const handleQuestionAnswer = (questionId, answer) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // تغيير نص التعليق
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };
  
  // إرسال التقييم
  const submitFeedback = () => {
    // التحقق من إكمال التقييم
    if (rating === 0) {
      alert('الرجاء تقييم اللعبة قبل الإرسال');
      return;
    }
    
    // تجميع بيانات التقييم
    const feedbackData = {
      username,
      rating,
      satisfaction,
      questionAnswers,
      feedback,
      timestamp: new Date().toISOString()
    };
    
    // في التطبيق الحقيقي، سيتم إرسال البيانات إلى السيرفر
    console.log('تم إرسال التقييم:', feedbackData);
    
    // عرض رسالة الشكر
    setSubmitted(true);
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
    
    // إغلاق نافذة التقييم بعد فترة
    setTimeout(() => {
      onClose && onClose();
    }, 3000);
  };
  
  return (
    <FeedbackContainer>
      {!submitted ? (
        <>
          <FeedbackHeader>
            <FeedbackTitle>شاركنا رأيك في اللعبة</FeedbackTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </FeedbackHeader>
          
          <FeedbackContent>
            <RatingSection>
              <RatingTitle>كيف تقيم تجربتك مع لعبة "حروف مع ياسر"؟</RatingTitle>
              <StarsContainer>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {star <= (hoverRating || rating) ? <FaStar /> : <FaRegStar />}
                  </StarButton>
                ))}
              </StarsContainer>
              <RatingLabel>
                {rating === 1 && 'سيئة'}
                {rating === 2 && 'ضعيفة'}
                {rating === 3 && 'متوسطة'}
                {rating === 4 && 'جيدة'}
                {rating === 5 && 'ممتازة'}
              </RatingLabel>
            </RatingSection>
            
            <SatisfactionSection>
              <SatisfactionTitle>ما مدى رضاك عن اللعبة؟</SatisfactionTitle>
              <SatisfactionOptions>
                <SatisfactionButton
                  selected={satisfaction === 'happy'}
                  onClick={() => handleSatisfaction('happy')}
                >
                  <FaSmile />
                  <span>راضٍ جداً</span>
                </SatisfactionButton>
                
                <SatisfactionButton
                  selected={satisfaction === 'neutral'}
                  onClick={() => handleSatisfaction('neutral')}
                >
                  <FaMeh />
                  <span>محايد</span>
                </SatisfactionButton>
                
                <SatisfactionButton
                  selected={satisfaction === 'unhappy'}
                  onClick={() => handleSatisfaction('unhappy')}
                >
                  <FaFrown />
                  <span>غير راضٍ</span>
                </SatisfactionButton>
              </SatisfactionOptions>
            </SatisfactionSection>
            
            <QuestionsSection>
              <QuestionsTitle>أسئلة إضافية</QuestionsTitle>
              {feedbackQuestions.map(question => (
                <QuestionItem key={question.id}>
                  <QuestionText>{question.question}</QuestionText>
                  <OptionsContainer>
                    {question.options.map(option => (
                      <OptionButton
                        key={option}
                        selected={questionAnswers[question.id] === option}
                        onClick={() => handleQuestionAnswer(question.id, option)}
                      >
                        {option}
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                </QuestionItem>
              ))}
            </QuestionsSection>
            
            <CommentSection>
              <CommentTitle>
                <FaComment />
                <span>هل لديك أي اقتراحات أو ملاحظات إضافية؟</span>
              </CommentTitle>
              <CommentTextarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="اكتب تعليقك هنا..."
                rows={4}
              />
            </CommentSection>
            
            <SubmitButton onClick={submitFeedback}>
              <FaPaperPlane />
              <span>إرسال التقييم</span>
            </SubmitButton>
          </FeedbackContent>
        </>
      ) : (
        <ThankYouContainer show={showThankYou}>
          <ThankYouIcon>🎉</ThankYouIcon>
          <ThankYouTitle>شكراً لك!</ThankYouTitle>
          <ThankYouMessage>
            نشكرك على مشاركة رأيك معنا. تقييمك سيساعدنا في تحسين اللعبة.
          </ThankYouMessage>
        </ThankYouContainer>
      )}
    </FeedbackContainer>
  );
};

const FeedbackContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: background-color var(--transition-speed);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-color);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 20px;
  }
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background-color: var(--card-bg);
  z-index: 1;
`;

const FeedbackTitle = styled.h3`
  margin: 0;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
    color: var(--text-color);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const FeedbackContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`;

const RatingTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  text-align: center;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: gold;
  font-size: 2rem;
  transition: transform var(--transition-speed);
  
  &:hover {
    transform: scale(1.2);
  }
  
  svg {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
  }
`;

const RatingLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  height: 20px;
`;

const SatisfactionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const SatisfactionTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  text-align: center;
`;

const SatisfactionOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const SatisfactionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background-color: ${props => props.selected ? 'var(--primary-color-light)' : 'var(--background-color)'};
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-speed);
  min-width: 100px;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-color-light)' : 'var(--border-color)'};
  }
  
  svg {
    font-size: 1.5rem;
    color: ${props => {
      if (props.selected) {
        return 'var(--primary-color)';
      }
      if (props.children[0].type === FaSmile) return 'var(--button-success)';
      if (props.children[0].type === FaMeh) return 'var(--button-warning)';
      if (props.children[0].type === FaFrown) return 'var(--button-danger)';
      return 'var(--text-color)';
    }};
  }
  
  span {
    color: var(--text-color);
    font-size: 0.9rem;
  }
`;

const QuestionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const QuestionsTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
`;

const QuestionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const QuestionText = styled.div`
  color: var(--text-color);
  font-weight: 600;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
`;

const OptionButton = styled.button`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.selected ? 'var(--primary-color-light)' : 'var(--background-color)'};
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius-sm);
  color: ${props => props.selected ? 'var(--primary-color)' : 'var(--text-color)'};
  cursor: pointer;
  transition: all var(--transition-speed);
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-color-light)' : 'var(--border-color)'};
  }
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CommentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-color);
  font-weight: 600;
  
  svg {
    color: var(--primary-color);
  }
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--background-color);
  color: var(--text-color);
  resize: vertical;
  transition: all var(--transition-speed);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--button-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-speed);
  margin-top: var(--spacing-sm);
  
  &:hover {
    background-color: var(--primary-color);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ThankYouContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  text-align: center;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'scale(1)' : 'scale(0.9)'};
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const ThankYouIcon = styled.div`
  font-size: 4rem;
  animation: bounce 1s infinite alternate;
  
  @keyframes bounce {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-10px);
    }
  }
`;

const ThankYouTitle = styled.h2`
  color: var(--primary-color);
  margin: 0;
`;

const ThankYouMessage = styled.p`
  color: var(--text-secondary);
  max-width: 400px;
  line-height: 1.6;
`;

export default PlayerFeedbackSystem;
