import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaGift, FaCheck, FaLock, FaCoins, FaStar } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const DailyMissions = () => {
  const { username, userId } = useUser();
  
  const [missions, setMissions] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  
  // محاكاة استرجاع المهمات اليومية من السيرفر
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استرجاع هذه البيانات من السيرفر
    const mockMissions = [
      {
        id: 'mission1',
        title: 'الإجابة على 5 أسئلة',
        description: 'أجب على 5 أسئلة بشكل صحيح في يوم واحد',
        reward: 50,
        progress: 3,
        target: 5,
        completed: false
      },
      {
        id: 'mission2',
        title: 'الفوز بجولة',
        description: 'فز بجولة واحدة على الأقل',
        reward: 100,
        progress: 1,
        target: 1,
        completed: true
      },
      {
        id: 'mission3',
        title: 'اللعب مع أصدقاء',
        description: 'العب مع 3 أصدقاء مختلفين',
        reward: 75,
        progress: 1,
        target: 3,
        completed: false
      }
    ];
    
    setMissions(mockMissions);
    setUserPoints(250);
  }, []);
  
  // تحديث تقدم المهمة
  const updateMissionProgress = (missionId, newProgress) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => 
        mission.id === missionId 
          ? { 
              ...mission, 
              progress: newProgress,
              completed: newProgress >= mission.target 
            } 
          : mission
      )
    );
  };
  
  // استلام مكافأة المهمة
  const claimReward = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    
    if (mission && mission.completed) {
      // إضافة النقاط إلى رصيد المستخدم
      setUserPoints(prevPoints => prevPoints + mission.reward);
      
      // تحديث حالة المهمة
      setMissions(prevMissions => 
        prevMissions.map(m => 
          m.id === missionId 
            ? { ...m, claimed: true } 
            : m
        )
      );
      
      // في التطبيق الحقيقي، سيتم إرسال هذه البيانات إلى السيرفر
      // api.claimMissionReward(userId, missionId);
    }
  };
  
  // حساب نسبة التقدم
  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };
  
  return (
    <MissionsContainer>
      <MissionsHeader>
        <MissionsTitle>
          <FaTrophy />
          <span>المهمات اليومية</span>
        </MissionsTitle>
        <UserPoints>
          <FaCoins />
          <span>{userPoints}</span>
        </UserPoints>
      </MissionsHeader>
      
      <MissionsList>
        {missions.map(mission => (
          <MissionItem key={mission.id} completed={mission.completed}>
            <MissionContent>
              <MissionTitle>{mission.title}</MissionTitle>
              <MissionDescription>{mission.description}</MissionDescription>
              
              <MissionProgressContainer>
                <MissionProgressBar>
                  <MissionProgressFill 
                    progress={calculateProgress(mission.progress, mission.target)}
                    completed={mission.completed}
                  />
                </MissionProgressBar>
                <MissionProgressText>
                  {mission.progress}/{mission.target}
                </MissionProgressText>
              </MissionProgressContainer>
            </MissionContent>
            
            <MissionReward>
              <RewardAmount>
                <FaCoins />
                <span>{mission.reward}</span>
              </RewardAmount>
              
              {mission.completed ? (
                mission.claimed ? (
                  <ClaimedButton disabled>
                    <FaCheck />
                    <span>تم الاستلام</span>
                  </ClaimedButton>
                ) : (
                  <ClaimButton onClick={() => claimReward(mission.id)}>
                    <span>استلام</span>
                  </ClaimButton>
                )
              ) : (
                <LockedButton disabled>
                  <FaLock />
                  <span>غير مكتمل</span>
                </LockedButton>
              )}
            </MissionReward>
          </MissionItem>
        ))}
      </MissionsList>
      
      <RefreshInfo>
        يتم تحديث المهمات اليومية كل 24 ساعة
      </RefreshInfo>
    </MissionsContainer>
  );
};

const MissionsContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const MissionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const MissionsTitle = styled.h3`
  margin: 0;
  color: var(--primary-color);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  svg {
    color: gold;
  }
`;

const UserPoints = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  
  svg {
    color: gold;
  }
`;

const MissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const MissionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.completed ? 'rgba(46, 204, 113, 0.1)' : 'var(--background-color)'};
  border-right: 3px solid ${props => props.completed ? 'var(--button-success)' : 'var(--border-color)'};
  transition: all var(--transition-speed);
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const MissionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const MissionTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
`;

const MissionDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const MissionProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
`;

const MissionProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
`;

const MissionProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => props.completed ? 'var(--button-success)' : 'var(--primary-color)'};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const MissionProgressText = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
`;

const MissionReward = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
  
  @media (min-width: 768px) {
    min-width: 120px;
  }
`;

const RewardAmount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-color);
  
  svg {
    color: gold;
  }
`;

const ClaimButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: var(--button-success);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-speed);
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
`;

const ClaimedButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: var(--border-color);
  color: var(--text-secondary);
  border: none;
  cursor: not-allowed;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
`;

const LockedButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  cursor: not-allowed;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
`;

const RefreshInfo = styled.div`
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-style: italic;
  margin-top: var(--spacing-sm);
`;

export default DailyMissions;
