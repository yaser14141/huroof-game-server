import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaExpand, FaCompress, FaInfoCircle, FaUser, FaClock, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const InteractiveCell = ({ letter, team, capturedBy, captureTime, answer, onClick }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // توسيع/تصغير الخلية
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // إغلاق الخلية عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && !event.target.closest('.interactive-cell-expanded')) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  // تنسيق التاريخ والوقت
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'غير محدد';
    
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <CellContainer 
        team={team} 
        onClick={onClick || toggleExpand}
        className={isExpanded ? 'expanded' : ''}
      >
        <CellLetter>{letter}</CellLetter>
        {capturedBy && (
          <CellOwner team={team}>
            <OwnerAvatar>{capturedBy.avatar || '👤'}</OwnerAvatar>
          </CellOwner>
        )}
        <ExpandButton onClick={(e) => {
          e.stopPropagation();
          toggleExpand();
        }}>
          <FaExpand />
        </ExpandButton>
      </CellContainer>
      
      {isExpanded && (
        <ExpandedCellOverlay>
          <ExpandedCellContainer className="interactive-cell-expanded">
            <ExpandedCellHeader>
              <ExpandedCellTitle>معلومات الخلية</ExpandedCellTitle>
              <CloseButton onClick={toggleExpand}>
                <FaCompress />
              </CloseButton>
            </ExpandedCellHeader>
            
            <ExpandedCellContent>
              <LetterSection>
                <BigLetter team={team}>{letter}</BigLetter>
              </LetterSection>
              
              <InfoSection>
                <InfoItem>
                  <InfoIcon>
                    <FaUser />
                  </InfoIcon>
                  <InfoLabel>تم احتلالها بواسطة:</InfoLabel>
                  <InfoValue>
                    {capturedBy ? (
                      <OwnerInfo>
                        <OwnerAvatarLarge>{capturedBy.avatar || '👤'}</OwnerAvatarLarge>
                        <OwnerName team={team}>{capturedBy.username || 'غير معروف'}</OwnerName>
                      </OwnerInfo>
                    ) : (
                      'لم يتم احتلالها بعد'
                    )}
                  </InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <FaClock />
                  </InfoIcon>
                  <InfoLabel>وقت الاحتلال:</InfoLabel>
                  <InfoValue>{formatDateTime(captureTime)}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <FaCheck />
                  </InfoIcon>
                  <InfoLabel>الإجابة الصحيحة:</InfoLabel>
                  <InfoValue>{answer || 'غير متوفر'}</InfoValue>
                </InfoItem>
                
                <TeamInfo team={team}>
                  {team === 1 ? 'الفريق الأحمر' : team === 2 ? 'الفريق الأزرق' : 'غير محتلة'}
                </TeamInfo>
              </InfoSection>
            </ExpandedCellContent>
          </ExpandedCellContainer>
        </ExpandedCellOverlay>
      )}
    </>
  );
};

const CellContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  background-color: ${props => 
    props.team === 1 ? 'var(--team1-color-light)' : 
    props.team === 2 ? 'var(--team2-color-light)' : 
    'var(--card-bg)'
  };
  border: 2px solid ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 
    'var(--border-color)'
  };
  border-radius: var(--border-radius-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-speed);
  box-shadow: ${props => props.team ? 'var(--shadow-sm)' : 'none'};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }
  
  &.expanded {
    z-index: 1000;
  }
  
  @media (max-width: 576px) {
    width: 50px;
    height: 50px;
  }
`;

const CellLetter = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  
  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`;

const CellOwner = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 
    'var(--primary-color)'
  };
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
`;

const OwnerAvatar = styled.div`
  font-size: 0.7rem;
  color: white;
`;

const ExpandButton = styled.button`
  position: absolute;
  top: -5px;
  left: -5px;
  width: 18px;
  height: 18px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
  font-size: 0.6rem;
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity var(--transition-speed);
  
  ${CellContainer}:hover & {
    opacity: 1;
  }
`;

const ExpandedCellOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ExpandedCellContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: background-color var(--transition-speed);
  
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

const ExpandedCellHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const ExpandedCellTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
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

const ExpandedCellContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  gap: var(--spacing-md);
  
  @media (min-width: 576px) {
    flex-direction: row;
  }
`;

const LetterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-md);
  
  @media (min-width: 576px) {
    flex: 1;
  }
`;

const BigLetter = styled.div`
  font-size: 5rem;
  font-weight: 700;
  color: ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 
    'var(--text-color)'
  };
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  
  @media (min-width: 576px) {
    flex: 2;
    border-right: 1px solid var(--border-color);
    padding-right: var(--spacing-md);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`;

const InfoIcon = styled.div`
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: var(--text-color);
  min-width: 120px;
`;

const InfoValue = styled.div`
  color: var(--text-secondary);
  flex: 1;
`;

const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const OwnerAvatarLarge = styled.div`
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  border-radius: 50%;
`;

const OwnerName = styled.div`
  font-weight: 600;
  color: ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 
    'var(--text-color)'
  };
`;

const TeamInfo = styled.div`
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: ${props => 
    props.team === 1 ? 'var(--team1-color-light)' : 
    props.team === 2 ? 'var(--team2-color-light)' : 
    'var(--background-color)'
  };
  color: ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 
    'var(--text-secondary)'
  };
  border-radius: var(--border-radius-sm);
  text-align: center;
  font-weight: 600;
`;

export default InteractiveCell;
