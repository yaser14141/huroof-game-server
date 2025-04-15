import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaUserPlus, FaUserMinus, FaRandom, FaExchangeAlt } from 'react-icons/fa';
import { useGame } from '../context/GameContext';

const TeamManager = () => {
  const { players, teams, assignPlayerToTeam, distributeTeamsRandomly } = useGame();
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [spectators, setSpectators] = useState([]);
  
  // تحديث قوائم اللاعبين عند تغيير البيانات
  useEffect(() => {
    if (players && teams) {
      setTeam1Players(players.filter(player => teams.team1.includes(player.id)));
      setTeam2Players(players.filter(player => teams.team2.includes(player.id)));
      setSpectators(players.filter(player => 
        !teams.team1.includes(player.id) && !teams.team2.includes(player.id)
      ));
    }
  }, [players, teams]);
  
  // نقل لاعب من فريق إلى آخر
  const movePlayer = (playerId, fromTeam, toTeam) => {
    assignPlayerToTeam(playerId, toTeam);
  };
  
  // إضافة لاعب من المشاهدين إلى فريق
  const addPlayerToTeam = (playerId, teamNumber) => {
    assignPlayerToTeam(playerId, teamNumber);
  };
  
  // إزالة لاعب من فريق (تحويله إلى مشاهد)
  const removePlayerFromTeam = (playerId) => {
    // يمكن تنفيذ هذا عن طريق تعيين اللاعب إلى فريق رقم 0 (مشاهد)
    // هذه الوظيفة يجب إضافتها إلى سياق اللعبة
    // assignPlayerToTeam(playerId, 0);
  };
  
  // تبديل فريقي لاعبين
  const swapPlayers = (player1Id, player2Id) => {
    const player1Team = teams.team1.includes(player1Id) ? 1 : 2;
    const player2Team = teams.team1.includes(player2Id) ? 1 : 2;
    
    assignPlayerToTeam(player1Id, player2Team);
    assignPlayerToTeam(player2Id, player1Team);
  };
  
  return (
    <TeamManagerContainer>
      <TeamManagerHeader>
        <TeamManagerTitle>إدارة الفرق</TeamManagerTitle>
        <RandomizeButton onClick={distributeTeamsRandomly}>
          <FaRandom />
          <span>توزيع عشوائي</span>
        </RandomizeButton>
      </TeamManagerHeader>
      
      <TeamsContainer>
        <TeamColumn>
          <TeamHeader team={1}>الفريق الأول</TeamHeader>
          <PlayersList>
            {team1Players.map(player => (
              <PlayerItem key={player.id}>
                <PlayerName>{player.username}</PlayerName>
                <PlayerActions>
                  <ActionButton 
                    title="نقل إلى الفريق الثاني"
                    onClick={() => movePlayer(player.id, 1, 2)}
                  >
                    <FaExchangeAlt />
                  </ActionButton>
                  <ActionButton 
                    title="إزالة من الفريق"
                    onClick={() => removePlayerFromTeam(player.id)}
                  >
                    <FaUserMinus />
                  </ActionButton>
                </PlayerActions>
              </PlayerItem>
            ))}
            {team1Players.length === 0 && (
              <EmptyTeamMessage>لا يوجد لاعبين في هذا الفريق</EmptyTeamMessage>
            )}
          </PlayersList>
        </TeamColumn>
        
        <TeamColumn>
          <TeamHeader team={2}>الفريق الثاني</TeamHeader>
          <PlayersList>
            {team2Players.map(player => (
              <PlayerItem key={player.id}>
                <PlayerName>{player.username}</PlayerName>
                <PlayerActions>
                  <ActionButton 
                    title="نقل إلى الفريق الأول"
                    onClick={() => movePlayer(player.id, 2, 1)}
                  >
                    <FaExchangeAlt />
                  </ActionButton>
                  <ActionButton 
                    title="إزالة من الفريق"
                    onClick={() => removePlayerFromTeam(player.id)}
                  >
                    <FaUserMinus />
                  </ActionButton>
                </PlayerActions>
              </PlayerItem>
            ))}
            {team2Players.length === 0 && (
              <EmptyTeamMessage>لا يوجد لاعبين في هذا الفريق</EmptyTeamMessage>
            )}
          </PlayersList>
        </TeamColumn>
      </TeamsContainer>
      
      <SpectatorsSection>
        <SpectatorsHeader>المشاهدون</SpectatorsHeader>
        <PlayersList>
          {spectators.map(player => (
            <PlayerItem key={player.id}>
              <PlayerName>{player.username}</PlayerName>
              <PlayerActions>
                <ActionButton 
                  title="إضافة إلى الفريق الأول"
                  onClick={() => addPlayerToTeam(player.id, 1)}
                >
                  <FaUserPlus style={{ color: 'var(--team1-color)' }} />
                </ActionButton>
                <ActionButton 
                  title="إضافة إلى الفريق الثاني"
                  onClick={() => addPlayerToTeam(player.id, 2)}
                >
                  <FaUserPlus style={{ color: 'var(--team2-color)' }} />
                </ActionButton>
              </PlayerActions>
            </PlayerItem>
          ))}
          {spectators.length === 0 && (
            <EmptyTeamMessage>لا يوجد مشاهدين</EmptyTeamMessage>
          )}
        </PlayersList>
      </SpectatorsSection>
      
      <TeamBalanceInfo>
        <BalanceItem>
          <BalanceLabel>الفريق الأول:</BalanceLabel>
          <BalanceValue>{team1Players.length} لاعبين</BalanceValue>
        </BalanceItem>
        <BalanceItem>
          <BalanceLabel>الفريق الثاني:</BalanceLabel>
          <BalanceValue>{team2Players.length} لاعبين</BalanceValue>
        </BalanceItem>
      </TeamBalanceInfo>
    </TeamManagerContainer>
  );
};

const TeamManagerContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const TeamManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
`;

const TeamManagerTitle = styled.h3`
  color: var(--text-color);
  margin: 0;
  font-size: 1.2rem;
`;

const RandomizeButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
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
  
  svg {
    font-size: 1rem;
  }
`;

const TeamsContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TeamColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const TeamHeader = styled.h4`
  color: ${props => props.team === 1 ? 'var(--team1-color)' : 'var(--team2-color)'};
  margin: 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid ${props => props.team === 1 ? 'var(--team1-color)' : 'var(--team2-color)'};
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-height: 200px;
  overflow-y: auto;
`;

const PlayerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color);
  transition: background-color var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
  }
`;

const PlayerName = styled.div`
  font-weight: 600;
  color: var(--text-color);
`;

const PlayerActions = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
    color: var(--primary-color);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const EmptyTeamMessage = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-md);
  font-style: italic;
`;

const SpectatorsSection = styled.div`
  margin-bottom: var(--spacing-md);
`;

const SpectatorsHeader = styled.h4`
  color: var(--text-color);
  margin: 0 0 var(--spacing-sm) 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--border-color);
`;

const TeamBalanceInfo = styled.div`
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
`;

const BalanceItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const BalanceLabel = styled.span`
  color: var(--text-secondary);
  font-weight: 600;
`;

const BalanceValue = styled.span`
  color: var(--text-color);
`;

export default TeamManager;
