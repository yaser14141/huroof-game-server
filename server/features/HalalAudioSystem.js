import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const HalalAudioSystem = () => {
  const { theme } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  
  // قائمة المؤثرات الصوتية والأناشيد الحلال
  const audioTracks = [
    {
      id: 'background1',
      name: 'أصوات طبيعية هادئة',
      type: 'background',
      url: '/audio/nature_sounds.mp3'
    },
    {
      id: 'background2',
      name: 'أصوات فم إيقاعية',
      type: 'background',
      url: '/audio/vocal_beats.mp3'
    },
    {
      id: 'effect1',
      name: 'صوت النجاح',
      type: 'effect',
      url: '/audio/success.mp3'
    },
    {
      id: 'effect2',
      name: 'صوت الخطأ',
      type: 'effect',
      url: '/audio/error.mp3'
    },
    {
      id: 'effect3',
      name: 'صوت بدء الجولة',
      type: 'effect',
      url: '/audio/round_start.mp3'
    },
    {
      id: 'effect4',
      name: 'صوت انتهاء الجولة',
      type: 'effect',
      url: '/audio/round_end.mp3'
    },
    {
      id: 'effect5',
      name: 'صوت العد التنازلي',
      type: 'effect',
      url: '/audio/countdown.mp3'
    },
    {
      id: 'nasheed1',
      name: 'نشيد تحفيزي',
      type: 'nasheed',
      url: '/audio/motivational_nasheed.mp3'
    }
  ];
  
  // محاكاة تشغيل المؤثرات الصوتية
  const playEffect = (effectId) => {
    if (isMuted) return;
    
    const effect = audioTracks.find(track => track.id === effectId);
    if (effect) {
      console.log(`تشغيل المؤثر الصوتي: ${effect.name}`);
      // في التطبيق الحقيقي، سيتم تشغيل الصوت هنا
      // const audio = new Audio(effect.url);
      // audio.volume = volume / 100;
      // audio.play();
    }
  };
  
  // تشغيل/إيقاف الموسيقى الخلفية
  const toggleBackgroundAudio = () => {
    setIsPlaying(!isPlaying);
    
    // في التطبيق الحقيقي، سيتم تشغيل/إيقاف الصوت هنا
    console.log(`${isPlaying ? 'إيقاف' : 'تشغيل'} الصوت الخلفي: ${currentTrack?.name || 'لا يوجد'}`);
  };
  
  // تغيير المسار الحالي
  const changeTrack = (trackId) => {
    const track = audioTracks.find(track => track.id === trackId);
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // في التطبيق الحقيقي، سيتم تشغيل المسار الجديد هنا
      console.log(`تغيير المسار إلى: ${track.name}`);
    }
  };
  
  // تبديل حالة كتم الصوت
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // في التطبيق الحقيقي، سيتم كتم/إلغاء كتم جميع الأصوات هنا
    console.log(`${isMuted ? 'إلغاء كتم' : 'كتم'} الصوت`);
  };
  
  // تغيير مستوى الصوت
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    // في التطبيق الحقيقي، سيتم تغيير مستوى الصوت هنا
    console.log(`تغيير مستوى الصوت إلى: ${newVolume}%`);
  };
  
  // تعيين المسار الافتراضي عند التحميل
  useEffect(() => {
    const defaultTrack = audioTracks.find(track => track.id === 'background2');
    if (defaultTrack) {
      setCurrentTrack(defaultTrack);
    }
  }, []);
  
  // أمثلة على استخدام المؤثرات الصوتية
  const playExampleEffects = () => {
    // تشغيل صوت بدء الجولة
    playEffect('effect3');
    
    // تشغيل صوت العد التنازلي بعد ثانية
    setTimeout(() => playEffect('effect5'), 1000);
    
    // تشغيل صوت النجاح بعد 3 ثوانٍ
    setTimeout(() => playEffect('effect1'), 3000);
  };
  
  return (
    <AudioSystemContainer>
      <AudioHeader>
        <AudioTitle>نظام الصوت الحلال</AudioTitle>
        <MuteButton onClick={toggleMute} isMuted={isMuted}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </MuteButton>
      </AudioHeader>
      
      <VolumeControl>
        <VolumeLabel>مستوى الصوت: {volume}%</VolumeLabel>
        <VolumeSlider 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange}
          disabled={isMuted}
        />
      </VolumeControl>
      
      <CurrentTrackSection>
        <CurrentTrackLabel>المسار الحالي:</CurrentTrackLabel>
        <CurrentTrackInfo>
          {currentTrack ? (
            <>
              <TrackName>{currentTrack.name}</TrackName>
              <TrackType>{getTrackTypeLabel(currentTrack.type)}</TrackType>
            </>
          ) : (
            <NoTrackMessage>لم يتم اختيار مسار</NoTrackMessage>
          )}
        </CurrentTrackInfo>
        
        <PlayButton 
          onClick={toggleBackgroundAudio} 
          isPlaying={isPlaying}
          disabled={!currentTrack || isMuted}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
          <span>{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
        </PlayButton>
      </CurrentTrackSection>
      
      <TracksSection>
        <SectionTitle>المسارات المتاحة</SectionTitle>
        <TracksList>
          {audioTracks
            .filter(track => track.type === 'background' || track.type === 'nasheed')
            .map(track => (
              <TrackItem 
                key={track.id} 
                isActive={currentTrack?.id === track.id}
                onClick={() => changeTrack(track.id)}
                disabled={isMuted}
              >
                <TrackItemName>{track.name}</TrackItemName>
                <TrackItemType>{getTrackTypeLabel(track.type)}</TrackItemType>
              </TrackItem>
            ))}
        </TracksList>
      </TracksSection>
      
      <EffectsSection>
        <SectionTitle>المؤثرات الصوتية</SectionTitle>
        <EffectsList>
          {audioTracks
            .filter(track => track.type === 'effect')
            .map(effect => (
              <EffectButton 
                key={effect.id} 
                onClick={() => playEffect(effect.id)}
                disabled={isMuted}
              >
                {effect.name}
              </EffectButton>
            ))}
        </EffectsList>
      </EffectsSection>
      
      <DemoButton onClick={playExampleEffects} disabled={isMuted}>
        تجربة المؤثرات الصوتية
      </DemoButton>
    </AudioSystemContainer>
  );
};

// الحصول على تسمية نوع المسار
const getTrackTypeLabel = (type) => {
  switch (type) {
    case 'background':
      return 'خلفية صوتية';
    case 'effect':
      return 'مؤثر صوتي';
    case 'nasheed':
      return 'نشيد';
    default:
      return type;
  }
};

const AudioSystemContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const AudioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
`;

const AudioTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
  font-size: 1.2rem;
`;

const MuteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.isMuted ? 'var(--text-secondary)' : 'var(--primary-color)'};
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const VolumeLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const VolumeSlider = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: ${props => props.disabled ? 'var(--border-color)' : 'var(--primary-color-light)'};
  border-radius: 3px;
  outline: none;
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: opacity var(--transition-speed);
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.disabled ? 'var(--text-secondary)' : 'var(--primary-color)'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.disabled ? 'var(--text-secondary)' : 'var(--primary-color)'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border: none;
  }
`;

const CurrentTrackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
`;

const CurrentTrackLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const CurrentTrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const TrackName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
`;

const TrackType = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const NoTrackMessage = styled.div`
  font-style: italic;
  color: var(--text-secondary);
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: ${props => props.isPlaying ? 'var(--button-danger)' : 'var(--button-success)'};
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all var(--transition-speed);
  margin-top: var(--spacing-sm);
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const TracksSection = styled.div`
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

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-height: 150px;
  overflow-y: auto;
  
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

const TrackItem = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: ${props => props.isActive ? 'var(--primary-color-light)' : 'var(--background-color)'};
  border: 1px solid ${props => props.isActive ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius-sm);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all var(--transition-speed);
  text-align: right;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.isActive ? 'var(--primary-color-light)' : 'var(--border-color)'};
  }
`;

const TrackItemName = styled.div`
  font-weight: 600;
  color: var(--text-color);
`;

const TrackItemType = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
`;

const EffectsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const EffectsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-xs);
`;

const EffectButton = styled.button`
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all var(--transition-speed);
  
  &:hover:not(:disabled) {
    background-color: var(--border-color);
  }
`;

const DemoButton = styled.button`
  padding: var(--spacing-sm);
  background-color: var(--button-info);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all var(--transition-speed);
  margin-top: var(--spacing-sm);
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export default HalalAudioSystem;
