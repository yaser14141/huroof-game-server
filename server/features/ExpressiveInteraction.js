import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSmile, FaLaugh, FaThumbsUp, FaSurprise, FaSadTear, FaAngry, FaClap, FaHeart, FaQuestionCircle } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { useGame } from '../../context/GameContext';

const ExpressiveInteraction = ({ roomId }) => {
  const { username, userId } = useUser();
  const { currentRoom } = useGame();
  
  const [activeEmojis, setActiveEmojis] = useState([]);
  const [cooldown, setCooldown] = useState(false);
  
  // قائمة الرموز التعبيرية المتاحة
  const availableEmojis = [
    { id: 'smile', icon: <FaSmile />, label: 'ابتسامة' },
    { id: 'laugh', icon: <FaLaugh />, label: 'ضحك' },
    { id: 'thumbsup', icon: <FaThumbsUp />, label: 'إعجاب' },
    { id: 'surprise', icon: <FaSurprise />, label: 'دهشة' },
    { id: 'sad', icon: <FaSadTear />, label: 'حزن' },
    { id: 'angry', icon: <FaAngry />, label: 'غضب' },
    { id: 'clap', icon: <FaClap />, label: 'تصفيق' },
    { id: 'heart', icon: <FaHeart />, label: 'حب' },
    { id: 'question', icon: <FaQuestionCircle />, label: 'سؤال' }
  ];
  
  // محاكاة استلام الرموز التعبيرية من اللاعبين الآخرين
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استلام هذه البيانات من السيرفر عبر Socket.io
    const mockEmojis = [
      {
        id: 'emoji1',
        userId: 'user1',
        username: 'أحمد',
        emojiId: 'clap',
        timestamp: Date.now() - 2000
      },
      {
        id: 'emoji2',
        userId: 'user2',
        username: 'محمد',
        emojiId: 'thumbsup',
        timestamp: Date.now() - 1000
      }
    ];
    
    setActiveEmojis(prev => [...prev, ...mockEmojis]);
    
    // إزالة الرموز التعبيرية بعد فترة زمنية
    const interval = setInterval(() => {
      setActiveEmojis(prev => prev.filter(emoji => Date.now() - emoji.timestamp < 3000));
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // إرسال رمز تعبيري
  const sendEmoji = (emojiId) => {
    if (cooldown) return;
    
    // إضافة الرمز التعبيري إلى القائمة المحلية
    const newEmoji = {
      id: `emoji-${Date.now()}`,
      userId,
      username: username || 'أنت',
      emojiId,
      timestamp: Date.now()
    };
    
    setActiveEmojis(prev => [...prev, newEmoji]);
    
    // في التطبيق الحقيقي، سيتم إرسال الرمز التعبيري إلى السيرفر
    // socket.emit('send_emoji', { roomId, emojiId });
    
    // تفعيل فترة انتظار لمنع إرسال الكثير من الرموز التعبيرية
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);
  };
  
  // الحصول على أيقونة الرمز التعبيري
  const getEmojiIcon = (emojiId) => {
    const emoji = availableEmojis.find(e => e.id === emojiId);
    return emoji ? emoji.icon : <FaSmile />;
  };
  
  return (
    <ExpressiveContainer>
      <EmojisPanel>
        {availableEmojis.map(emoji => (
          <EmojiButton 
            key={emoji.id} 
            onClick={() => sendEmoji(emoji.id)}
            disabled={cooldown}
            title={emoji.label}
          >
            {emoji.icon}
          </EmojiButton>
        ))}
      </EmojisPanel>
      
      <ActiveEmojisContainer>
        {activeEmojis.map(emoji => (
          <ActiveEmoji 
            key={emoji.id} 
            style={{ 
              animationDelay: `${Math.random() * 0.5}s`,
              right: `${Math.random() * 80}%`
            }}
          >
            <EmojiIcon>{getEmojiIcon(emoji.emojiId)}</EmojiIcon>
            <EmojiUsername>{emoji.username}</EmojiUsername>
          </ActiveEmoji>
        ))}
      </ActiveEmojisContainer>
    </ExpressiveContainer>
  );
};

const ExpressiveContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const EmojisPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
  padding: var(--spacing-sm);
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const EmojiButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  border: none;
  border-radius: 50%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all var(--transition-speed);
  color: var(--text-color);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-color-light);
    color: var(--primary-color);
    transform: scale(1.1);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ActiveEmojisContainer = styled.div`
  position: absolute;
  top: -100px;
  left: 0;
  right: 0;
  height: 100px;
  pointer-events: none;
  overflow: hidden;
`;

const ActiveEmoji = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatUp 3s ease-out forwards;
  
  @keyframes floatUp {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-100px);
    }
  }
`;

const EmojiIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
  background-color: var(--background-color);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
`;

const EmojiUsername = styled.div`
  font-size: 0.7rem;
  color: var(--text-secondary);
  background-color: var(--background-color);
  padding: 2px 6px;
  border-radius: 10px;
  margin-top: 2px;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default ExpressiveInteraction;
