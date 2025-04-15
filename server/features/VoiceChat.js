import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { useGame } from '../../context/GameContext';

const VoiceChat = ({ roomId }) => {
  const { username, userId } = useUser();
  const { isHost, gameState, currentQuestion, activePlayer } = useGame();
  
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [activeSpeakers, setActiveSpeakers] = useState([]);
  const [canSpeak, setCanSpeak] = useState(false);
  
  // محاكاة المتحدثين النشطين
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استلام هذه البيانات من السيرفر
    const mockActiveSpeakers = [
      {
        id: 'user1',
        username: 'أحمد',
        team: 1,
        isSpeaking: true
      },
      {
        id: 'user2',
        username: 'محمد',
        team: 2,
        isSpeaking: false
      }
    ];
    
    setActiveSpeakers(mockActiveSpeakers);
  }, []);
  
  // تحديد ما إذا كان المستخدم يمكنه التحدث
  useEffect(() => {
    if (isHost) {
      // المضيف يمكنه التحدث دائماً
      setCanSpeak(true);
    } else if (gameState === 'playing' && currentQuestion) {
      // اللاعب النشط فقط يمكنه التحدث أثناء اللعب
      setCanSpeak(activePlayer === userId);
    } else {
      // في حالة الانتظار، الجميع يمكنهم التحدث
      setCanSpeak(true);
    }
  }, [isHost, gameState, currentQuestion, activePlayer, userId]);
  
  // تبديل حالة الميكروفون
  const toggleMicrophone = () => {
    if (!canSpeak && !micEnabled) return;
    
    setMicEnabled(!micEnabled);
    
    // في التطبيق الحقيقي، سيتم إرسال الحالة الجديدة إلى السيرفر
    // socket.emit('toggle_mic', { roomId, enabled: !micEnabled });
  };
  
  // تبديل حالة السماعة
  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
    
    // في التطبيق الحقيقي، سيتم تنفيذ كتم الصوت هنا
  };
  
  return (
    <VoiceChatContainer>
      <VoiceChatHeader>
        <VoiceChatTitle>الدردشة الصوتية</VoiceChatTitle>
        <VoiceChatControls>
          <ControlButton 
            onClick={toggleSpeaker}
            active={speakerEnabled}
            title={speakerEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
          >
            {speakerEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </ControlButton>
          
          <ControlButton 
            onClick={toggleMicrophone}
            active={micEnabled}
            disabled={!canSpeak && !micEnabled}
            title={micEnabled ? 'إيقاف الميكروفون' : 'تشغيل الميكروفون'}
          >
            {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </ControlButton>
        </VoiceChatControls>
      </VoiceChatHeader>
      
      <VoiceChatStatus>
        {!canSpeak && !micEnabled ? (
          <StatusMessage>
            لا يمكنك التحدث الآن. انتظر دورك.
          </StatusMessage>
        ) : micEnabled ? (
          <StatusMessage active>
            الميكروفون نشط - يمكنك التحدث الآن
          </StatusMessage>
        ) : (
          <StatusMessage>
            الميكروفون متوقف
          </StatusMessage>
        )}
      </VoiceChatStatus>
      
      <ActiveSpeakersContainer>
        <SectionTitle>المتحدثون النشطون</SectionTitle>
        {activeSpeakers.length > 0 ? (
          <SpeakersList>
            {activeSpeakers.map(speaker => (
              <SpeakerItem 
                key={speaker.id} 
                isSpeaking={speaker.isSpeaking}
                team={speaker.team}
              >
                <SpeakerIcon isSpeaking={speaker.isSpeaking}>
                  {speaker.isSpeaking ? <FaMicrophone /> : <FaMicrophoneSlash />}
                </SpeakerIcon>
                <SpeakerName team={speaker.team}>
                  {speaker.username}
                </SpeakerName>
                {speaker.isSpeaking && (
                  <SpeakingIndicator />
                )}
              </SpeakerItem>
            ))}
          </SpeakersList>
        ) : (
          <NoSpeakersMessage>
            لا يوجد متحدثون نشطون حالياً
          </NoSpeakersMessage>
        )}
      </ActiveSpeakersContainer>
      
      {isHost && (
        <HostControls>
          <SectionTitle>تحكم المضيف</SectionTitle>
          <HostButton>
            كتم صوت الجميع
          </HostButton>
          <HostButton>
            فتح الميكروفون للجميع
          </HostButton>
        </HostControls>
      )}
    </VoiceChatContainer>
  );
};

const VoiceChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
  padding: var(--spacing-md);
  gap: var(--spacing-md);
`;

const VoiceChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
`;

const VoiceChatTitle = styled.h3`
  margin: 0;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const VoiceChatControls = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: var(--spacing-sm);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed);
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background-color: var(--border-color);
  }
  
  svg {
    font-size: 1.5rem;
  }
`;

const VoiceChatStatus = styled.div`
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
`;

const StatusMessage = styled.div`
  color: ${props => props.active ? 'var(--button-success)' : 'var(--text-secondary)'};
  font-size: 0.9rem;
  text-align: center;
  font-weight: ${props => props.active ? 600 : 400};
`;

const ActiveSpeakersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const SectionTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  font-size: 1rem;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
`;

const SpeakersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const SpeakerItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.isSpeaking ? 'rgba(46, 204, 113, 0.1)' : 'var(--background-color)'};
  border-right: 3px solid ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 'transparent'
  };
`;

const SpeakerIcon = styled.div`
  color: ${props => props.isSpeaking ? 'var(--button-success)' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpeakerName = styled.div`
  font-weight: 600;
  color: ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 'var(--text-color)'
  };
  flex: 1;
`;

const SpeakingIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--button-success);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background-color: var(--button-success);
    opacity: 0.5;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

const NoSpeakersMessage = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  padding: var(--spacing-md);
  font-style: italic;
`;

const HostControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
`;

const HostButton = styled.button`
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
  }
`;

export default VoiceChat;
