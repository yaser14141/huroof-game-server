import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaRedo } from 'react-icons/fa';
import { useGame } from '../../context/GameContext';

const GameResult = () => {
  const { winner, teamColors, resetGame } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // عرض تأثير الاحتفال عند تحديد الفائز
  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      
      // إيقاف تأثير الاحتفال بعد فترة
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [winner]);
  
  if (!winner) return null;
  
  return (
    <ResultOverlay>
      <ResultContainer>
        <ResultHeader>
          <FaTrophy />
          <ResultTitle>انتهت اللعبة!</ResultTitle>
        </ResultHeader>
        
        <WinnerAnnouncement team={winner}>
          <WinnerText>
            الفائز هو {winner === 1 ? 'الفريق الأول' : 'الفريق الثاني'}!
          </WinnerText>
          <WinnerIcon team={winner} color={winner === 1 ? teamColors.team1 : teamColors.team2} />
        </WinnerAnnouncement>
        
        <ResultActions>
          <PlayAgainButton onClick={resetGame}>
            <FaRedo />
            <span>لعب مرة أخرى</span>
          </PlayAgainButton>
        </ResultActions>
      </ResultContainer>
      
      {showConfetti && <Confetti />}
    </ResultOverlay>
  );
};

const ResultOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ResultContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  animation: scaleIn 0.5s ease;
  
  @keyframes scaleIn {
    from {
      transform: scale(0.8);
    }
    to {
      transform: scale(1);
    }
  }
`;

const ResultHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  
  svg {
    font-size: 3rem;
    color: gold;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
  text-align: center;
`;

const WinnerAnnouncement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.team === 1 ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)'};
`;

const WinnerText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  text-align: center;
`;

const WinnerIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    border: 2px solid ${props => props.color || 'var(--primary-color)'};
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
`;

const ResultActions = styled.div`
  display: flex;
  justify-content: center;
`;

const PlayAgainButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius-md);
  background-color: var(--button-primary);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

// مكون تأثير الاحتفال
const Confetti = () => {
  return <ConfettiContainer />;
};

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 120%;
    background-image: 
      radial-gradient(circle, var(--team1-color) 8px, transparent 8px),
      radial-gradient(circle, var(--team2-color) 8px, transparent 8px),
      radial-gradient(circle, var(--primary-color) 8px, transparent 8px),
      radial-gradient(circle, var(--secondary-color) 8px, transparent 8px),
      radial-gradient(circle, gold 8px, transparent 8px);
    background-size: 
      100px 100px,
      120px 120px,
      150px 150px,
      200px 200px,
      300px 300px;
    background-position: 
      0 0,
      40px 60px,
      130px 270px,
      70px 100px,
      0 200px;
    animation: confettiFall 10s linear infinite;
  }
  
  @keyframes confettiFall {
    0% {
      transform: translateY(-10%);
    }
    100% {
      transform: translateY(100%);
    }
  }
`;

export default GameResult;
