import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaComments, FaPaperPlane, FaUsers, FaUserFriends, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const ChatSystem = ({ roomId }) => {
  const { username, userId } = useUser();
  const { teamColors, currentRoom, isHost } = useGame();
  const { theme } = useTheme();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatEnabled, setChatEnabled] = useState(true);
  const [chatMode, setChatMode] = useState('all'); // 'all', 'team'
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  
  // تمرير إلى آخر رسالة عند إضافة رسائل جديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // محاكاة استلام رسائل من السيرفر
  useEffect(() => {
    // هذا مجرد محاكاة، في التطبيق الحقيقي سيتم استخدام Socket.io
    const mockServerMessages = [
      {
        id: 'msg1',
        sender: 'أحمد',
        senderId: 'user1',
        team: 1,
        content: 'مرحباً بالجميع!',
        timestamp: new Date(Date.now() - 15000).toISOString()
      },
      {
        id: 'msg2',
        sender: 'محمد',
        senderId: 'user2',
        team: 2,
        content: 'أنا جاهز للعب!',
        timestamp: new Date(Date.now() - 10000).toISOString()
      },
      {
        id: 'msg3',
        sender: 'النظام',
        senderId: 'system',
        team: null,
        content: 'بدأت اللعبة!',
        timestamp: new Date(Date.now() - 5000).toISOString(),
        isSystem: true
      }
    ];
    
    setMessages(mockServerMessages);
  }, []);
  
  // التمرير إلى أسفل الدردشة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // إرسال رسالة جديدة
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatEnabled) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: username,
      senderId: userId,
      team: 1, // يجب استبداله بالفريق الفعلي للمستخدم
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // إضافة الرسالة إلى القائمة المحلية
    setMessages(prev => [...prev, newMsg]);
    
    // في التطبيق الحقيقي، سيتم إرسال الرسالة إلى السيرفر هنا
    // socket.emit('send_message', { roomId, message: newMsg });
    
    // تشغيل صوت الإرسال إذا كان الصوت مفعلاً
    if (soundEnabled) {
      playMessageSound();
    }
    
    // مسح حقل الإدخال
    setNewMessage('');
  };
  
  // تشغيل صوت عند استلام رسالة
  const playMessageSound = () => {
    // يمكن هنا تنفيذ تشغيل الصوت
    console.log('تشغيل صوت الرسالة');
  };
  
  // تبديل حالة تفعيل الدردشة (للمضيف فقط)
  const toggleChatEnabled = () => {
    if (isHost) {
      setChatEnabled(!chatEnabled);
      
      // في التطبيق الحقيقي، سيتم إرسال الحالة الجديدة إلى السيرفر
      // socket.emit('toggle_chat', { roomId, enabled: !chatEnabled });
      
      // إضافة رسالة نظام
      const systemMsg = {
        id: `system-${Date.now()}`,
        sender: 'النظام',
        senderId: 'system',
        team: null,
        content: chatEnabled ? 'تم تعطيل الدردشة بواسطة المضيف' : 'تم تفعيل الدردشة بواسطة المضيف',
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      
      setMessages(prev => [...prev, systemMsg]);
    }
  };
  
  // تبديل وضع الدردشة (عام/فريق)
  const toggleChatMode = () => {
    setChatMode(prev => prev === 'all' ? 'team' : 'all');
    
    // إضافة رسالة نظام
    const systemMsg = {
      id: `system-${Date.now()}`,
      sender: 'النظام',
      senderId: 'system',
      team: null,
      content: chatMode === 'all' ? 'تم تغيير وضع الدردشة إلى الفريق فقط' : 'تم تغيير وضع الدردشة إلى عام',
      timestamp: new Date().toISOString(),
      isSystem: true
    };
    
    setMessages(prev => [...prev, systemMsg]);
  };
  
  // تبديل حالة الصوت
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  // تنسيق التاريخ والوقت
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };
  
  // فلترة الرسائل حسب وضع الدردشة
  const filteredMessages = messages.filter(msg => {
    if (msg.isSystem) return true;
    if (chatMode === 'all') return true;
    // في وضع الفريق، عرض رسائل الفريق فقط
    return msg.team === 1; // يجب استبداله بالفريق الفعلي للمستخدم
  });
  
  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          <FaComments />
          <span>الدردشة</span>
        </ChatTitle>
        
        <ChatControls>
          {isHost && (
            <ControlButton 
              title={chatEnabled ? 'تعطيل الدردشة' : 'تفعيل الدردشة'}
              onClick={toggleChatEnabled}
              active={chatEnabled}
            >
              <FaComments />
            </ControlButton>
          )}
          
          <ControlButton 
            title={chatMode === 'all' ? 'تغيير إلى دردشة الفريق' : 'تغيير إلى دردشة عامة'}
            onClick={toggleChatMode}
            active={chatMode === 'team'}
          >
            {chatMode === 'all' ? <FaUsers /> : <FaUserFriends />}
          </ControlButton>
          
          <ControlButton 
            title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
            onClick={toggleSound}
            active={soundEnabled}
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </ControlButton>
        </ChatControls>
      </ChatHeader>
      
      <ChatStatus>
        {!chatEnabled && (
          <StatusMessage>
            الدردشة معطلة حالياً بواسطة المضيف
          </StatusMessage>
        )}
        
        {chatMode === 'team' && (
          <StatusMessage>
            أنت في وضع دردشة الفريق - الرسائل مرئية لفريقك فقط
          </StatusMessage>
        )}
      </ChatStatus>
      
      <MessagesContainer>
        {filteredMessages.map(msg => (
          <MessageItem 
            key={msg.id} 
            isSystem={msg.isSystem}
            isCurrentUser={msg.senderId === userId}
            team={msg.team}
          >
            {!msg.isSystem && (
              <MessageSender team={msg.team}>
                {msg.sender}
              </MessageSender>
            )}
            
            <MessageContent isSystem={msg.isSystem}>
              {msg.content}
            </MessageContent>
            
            <MessageTime>
              {formatTime(msg.timestamp)}
            </MessageTime>
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <ChatInputForm onSubmit={sendMessage} disabled={!chatEnabled}>
        <ChatInput
          type="text"
          placeholder={chatEnabled ? "اكتب رسالتك هنا..." : "الدردشة معطلة"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!chatEnabled}
        />
        <SendButton type="submit" disabled={!chatEnabled}>
          <FaPaperPlane />
        </SendButton>
      </ChatInputForm>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 500px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--primary-color);
  font-weight: 600;
  
  svg {
    font-size: 1.2rem;
  }
`;

const ChatControls = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  cursor: pointer;
  padding: var(--spacing-xs);
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

const ChatStatus = styled.div`
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--background-color);
`;

const StatusMessage = styled.div`
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-align: center;
  font-style: italic;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  
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

const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  background-color: ${props => 
    props.isSystem ? 'var(--background-color)' : 
    props.isCurrentUser ? 'var(--primary-color-light)' : 'var(--background-color)'
  };
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  border-right: ${props => 
    !props.isSystem && !props.isCurrentUser && props.team === 1 ? '3px solid var(--team1-color)' : 
    !props.isSystem && !props.isCurrentUser && props.team === 2 ? '3px solid var(--team2-color)' : 'none'
  };
  border-left: ${props => 
    !props.isSystem && props.isCurrentUser ? '3px solid var(--primary-color)' : 'none'
  };
`;

const MessageSender = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-xs);
  color: ${props => 
    props.team === 1 ? 'var(--team1-color)' : 
    props.team === 2 ? 'var(--team2-color)' : 'var(--text-color)'
  };
`;

const MessageContent = styled.div`
  color: ${props => props.isSystem ? 'var(--text-secondary)' : 'var(--text-color)'};
  font-style: ${props => props.isSystem ? 'italic' : 'normal'};
  font-size: ${props => props.isSystem ? '0.9rem' : '1rem'};
  text-align: ${props => props.isSystem ? 'center' : 'start'};
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  color: var(--text-secondary);
  align-self: flex-end;
  margin-top: var(--spacing-xs);
`;

const ChatInputForm = styled.form`
  display: flex;
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  opacity: ${props => props.disabled ? 0.7 : 1};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
  border: 1px solid var(--border-color);
  border-right: none;
  background-color: var(--background-color);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
  background-color: var(--button-primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: all var(--transition-speed);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-color);
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
  
  svg {
    font-size: 1rem;
  }
`;

export default ChatSystem;
