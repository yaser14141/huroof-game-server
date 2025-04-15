import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo, FaDownload, FaShare, FaExpand, FaCompress } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const ReplaySystem = ({ gameId }) => {
  const { username } = useUser();
  
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const replayContainerRef = useRef(null);
  const timerRef = useRef(null);
  
  // محاكاة استرجاع بيانات التسجيل من السيرفر
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استرجاع هذه البيانات من السيرفر
    const mockRecording = {
      id: 'rec123',
      title: 'مباراة مع أحمد ومحمد',
      date: '2025-04-14T12:30:00Z',
      duration: 300, // بالثواني
      events: [
        { time: 0, type: 'game_start', data: { teams: [{ id: 1, name: 'الفريق الأحمر' }, { id: 2, name: 'الفريق الأزرق' }] } },
        { time: 10, type: 'question', data: { question: 'ما هو أكبر محيط في العالم؟', letter: 'م' } },
        { time: 15, type: 'player_answer', data: { playerId: 'user1', username: 'أحمد', answer: 'محيط هادي', isCorrect: true } },
        { time: 30, type: 'cell_capture', data: { cellId: '1-2', team: 1, letter: 'م' } },
        { time: 45, type: 'question', data: { question: 'ما هو الحيوان الذي ينام واقفاً؟', letter: 'ح' } },
        { time: 55, type: 'player_answer', data: { playerId: 'user2', username: 'محمد', answer: 'حصان', isCorrect: true } },
        { time: 70, type: 'cell_capture', data: { cellId: '2-3', team: 2, letter: 'ح' } },
        // المزيد من الأحداث...
        { time: 290, type: 'game_end', data: { winner: 1, score: { team1: 5, team2: 3 } } }
      ]
    };
    
    setRecording(mockRecording);
    setDuration(mockRecording.duration);
  }, [gameId]);
  
  // تشغيل/إيقاف التسجيل
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + playbackSpeed;
          
          // إيقاف التشغيل عند الوصول إلى النهاية
          if (newTime >= duration) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return duration;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isPlaying, duration, playbackSpeed]);
  
  // الحصول على الأحداث الحالية بناءً على الوقت
  const getCurrentEvents = () => {
    if (!recording) return [];
    
    // الحصول على جميع الأحداث حتى الوقت الحالي
    return recording.events.filter(event => event.time <= currentTime);
  };
  
  // تشغيل/إيقاف التسجيل
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // إعادة تشغيل التسجيل من البداية
  const restartPlayback = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  // التقدم للأمام بمقدار 10 ثوانٍ
  const stepForward = () => {
    setCurrentTime(prevTime => Math.min(prevTime + 10, duration));
  };
  
  // الرجوع للخلف بمقدار 10 ثوانٍ
  const stepBackward = () => {
    setCurrentTime(prevTime => Math.max(prevTime - 10, 0));
  };
  
  // تغيير سرعة التشغيل
  const changePlaybackSpeed = (speed) => {
    setPlaybackSpeed(speed);
  };
  
  // تغيير وقت التشغيل
  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };
  
  // تبديل وضع ملء الشاشة
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (replayContainerRef.current.requestFullscreen) {
        replayContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // تنسيق الوقت بصيغة MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // تنزيل التسجيل
  const downloadRecording = () => {
    // في التطبيق الحقيقي، سيتم تنفيذ تنزيل التسجيل هنا
    console.log('تنزيل التسجيل:', recording.id);
  };
  
  // مشاركة التسجيل
  const shareRecording = () => {
    // في التطبيق الحقيقي، سيتم تنفيذ مشاركة التسجيل هنا
    console.log('مشاركة التسجيل:', recording.id);
  };
  
  if (!recording) {
    return (
      <LoadingContainer>
        جاري تحميل التسجيل...
      </LoadingContainer>
    );
  }
  
  // الحصول على الأحداث الحالية
  const currentEvents = getCurrentEvents();
  const lastEvent = currentEvents.length > 0 ? currentEvents[currentEvents.length - 1] : null;
  
  return (
    <ReplayContainer ref={replayContainerRef} isFullscreen={isFullscreen}>
      <ReplayHeader>
        <ReplayTitle>{recording.title}</ReplayTitle>
        <ReplayDate>{new Date(recording.date).toLocaleDateString('ar-SA')}</ReplayDate>
      </ReplayHeader>
      
      <ReplayContent>
        <GameStateDisplay>
          {lastEvent && lastEvent.type === 'game_end' ? (
            <GameEndState>
              <WinnerAnnouncement>
                الفائز: {lastEvent.data.winner === 1 ? 'الفريق الأحمر' : 'الفريق الأزرق'}
              </WinnerAnnouncement>
              <ScoreDisplay>
                <TeamScore team={1}>الفريق الأحمر: {lastEvent.data.score.team1}</TeamScore>
                <TeamScore team={2}>الفريق الأزرق: {lastEvent.data.score.team2}</TeamScore>
              </ScoreDisplay>
            </GameEndState>
          ) : lastEvent && lastEvent.type === 'question' ? (
            <QuestionState>
              <QuestionLetter>{lastEvent.data.letter}</QuestionLetter>
              <QuestionText>{lastEvent.data.question}</QuestionText>
            </QuestionState>
          ) : lastEvent && lastEvent.type === 'player_answer' ? (
            <AnswerState correct={lastEvent.data.isCorrect}>
              <PlayerName>{lastEvent.data.username}</PlayerName>
              <AnswerText>
                الإجابة: {lastEvent.data.answer}
                {lastEvent.data.isCorrect ? ' ✓' : ' ✗'}
              </AnswerText>
            </AnswerState>
          ) : lastEvent && lastEvent.type === 'cell_capture' ? (
            <CellCaptureState>
              <CellInfo>
                تم احتلال الخلية {lastEvent.data.cellId} بواسطة 
                {lastEvent.data.team === 1 ? ' الفريق الأحمر' : ' الفريق الأزرق'}
              </CellInfo>
              <CellLetter>{lastEvent.data.letter}</CellLetter>
            </CellCaptureState>
          ) : (
            <InitialState>
              بدء المباراة
            </InitialState>
          )}
        </GameStateDisplay>
        
        <EventsList>
          <EventsTitle>سجل الأحداث</EventsTitle>
          {currentEvents.map((event, index) => (
            <EventItem key={index} type={event.type}>
              <EventTime>{formatTime(event.time)}</EventTime>
              <EventContent>
                {event.type === 'game_start' && 'بدء المباراة'}
                {event.type === 'game_end' && `انتهاء المباراة - الفائز: ${event.data.winner === 1 ? 'الفريق الأحمر' : 'الفريق الأزرق'}`}
                {event.type === 'question' && `سؤال جديد: ${event.data.question}`}
                {event.type === 'player_answer' && `${event.data.username}: ${event.data.answer} ${event.data.isCorrect ? '✓' : '✗'}`}
                {event.type === 'cell_capture' && `تم احتلال الخلية ${event.data.cellId} بواسطة ${event.data.team === 1 ? 'الفريق الأحمر' : 'الفريق الأزرق'}`}
              </EventContent>
            </EventItem>
          ))}
        </EventsList>
      </ReplayContent>
      
      <ReplayControls>
        <TimeDisplay>
          <CurrentTime>{formatTime(currentTime)}</CurrentTime>
          <TotalTime>{formatTime(duration)}</TotalTime>
        </TimeDisplay>
        
        <TimelineContainer>
          <Timeline
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleTimeChange}
          />
        </TimelineContainer>
        
        <ControlButtons>
          <ControlButton onClick={restartPlayback} title="إعادة من البداية">
            <FaRedo />
          </ControlButton>
          
          <ControlButton onClick={stepBackward} title="رجوع 10 ثوانٍ">
            <FaStepBackward />
          </ControlButton>
          
          <PlayButton onClick={togglePlayback} title={isPlaying ? 'إيقاف' : 'تشغيل'}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayButton>
          
          <ControlButton onClick={stepForward} title="تقدم 10 ثوانٍ">
            <FaStepForward />
          </ControlButton>
          
          <SpeedSelector>
            <SpeedOption 
              active={playbackSpeed === 0.5} 
              onClick={() => changePlaybackSpeed(0.5)}
            >
              0.5x
            </SpeedOption>
            <SpeedOption 
              active={playbackSpeed === 1} 
              onClick={() => changePlaybackSpeed(1)}
            >
              1x
            </SpeedOption>
            <SpeedOption 
              active={playbackSpeed === 2} 
              onClick={() => changePlaybackSpeed(2)}
            >
              2x
            </SpeedOption>
          </SpeedSelector>
        </ControlButtons>
        
        <ExtraControls>
          <ControlButton onClick={downloadRecording} title="تنزيل التسجيل">
            <FaDownload />
          </ControlButton>
          
          <ControlButton onClick={shareRecording} title="مشاركة التسجيل">
            <FaShare />
          </ControlButton>
          
          <ControlButton onClick={toggleFullscreen} title={isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </ControlButton>
        </ExtraControls>
      </ReplayControls>
    </ReplayContainer>
  );
};

const ReplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border-radius: ${props => props.isFullscreen ? '0' : 'var(--border-radius-md)'};
  box-shadow: var(--shadow-md);
  transition: all var(--transition-speed);
  overflow: hidden;
  width: 100%;
  height: ${props => props.isFullscreen ? '100vh' : 'auto'};
  position: ${props => props.isFullscreen ? 'fixed' : 'relative'};
  top: ${props => props.isFullscreen ? '0' : 'auto'};
  left: ${props => props.isFullscreen ? '0' : 'auto'};
  right: ${props => props.isFullscreen ? '0' : 'auto'};
  bottom: ${props => props.isFullscreen ? '0' : 'auto'};
  z-index: ${props => props.isFullscreen ? '9999' : 'auto'};
`;

const ReplayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const ReplayTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
  font-size: 1.2rem;
`;

const ReplayDate = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ReplayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  flex: 1;
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const GameStateDisplay = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  min-height: 200px;
`;

const InitialState = styled.div`
  font-size: 1.5rem;
  color: var(--text-color);
  text-align: center;
`;

const GameEndState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`;

const WinnerAnnouncement = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-align: center;
`;

const ScoreDisplay = styled.div`
  display: flex;
  gap: var(--spacing-lg);
`;

const TeamScore = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.team === 1 ? 'var(--team1-color)' : 'var(--team2-color)'};
`;

const QuestionState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`;

const QuestionLetter = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const QuestionText = styled.div`
  font-size: 1.5rem;
  color: var(--text-color);
  text-align: center;
`;

const AnswerState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: ${props => props.correct ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  border-radius: var(--border-radius-md);
  border: 1px solid ${props => props.correct ? 'var(--button-success)' : 'var(--button-danger)'};
`;

const PlayerName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
`;

const AnswerText = styled.div`
  font-size: 1.5rem;
  color: var(--text-color);
`;

const CellCaptureState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`;

const CellInfo = styled.div`
  font-size: 1.2rem;
  color: var(--text-color);
  text-align: center;
`;

const CellLetter = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const EventsList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  overflow-y: auto;
  max-height: 300px;
  
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

const EventsTitle = styled.h4`
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-color);
  font-size: 1rem;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
`;

const EventItem = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: ${props => {
    switch (props.type) {
      case 'game_start':
      case 'game_end':
        return 'rgba(52, 152, 219, 0.1)';
      case 'question':
        return 'rgba(155, 89, 182, 0.1)';
      case 'player_answer':
        return 'rgba(46, 204, 113, 0.1)';
      case 'cell_capture':
        return 'rgba(230, 126, 34, 0.1)';
      default:
        return 'transparent';
    }
  }};
  border-right: 3px solid ${props => {
    switch (props.type) {
      case 'game_start':
      case 'game_end':
        return 'var(--button-info)';
      case 'question':
        return 'var(--secondary-color)';
      case 'player_answer':
        return 'var(--button-success)';
      case 'cell_capture':
        return 'var(--button-warning)';
      default:
        return 'transparent';
    }
  }};
`;

const EventTime = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 45px;
`;

const EventContent = styled.div`
  font-size: 0.9rem;
  color: var(--text-color);
`;

const ReplayControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrentTime = styled.div`
  font-size: 0.9rem;
  color: var(--text-color);
`;

const Tot
(Content truncated due to size limit. Use line ranges to read in chunks)