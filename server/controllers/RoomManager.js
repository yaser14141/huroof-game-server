import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaKey, FaLock, FaUnlock, FaCopy, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

const RoomManager = () => {
  const { createRoom, joinRoom, rooms, currentRoom } = useGame();
  const { username, isLoggedIn } = useUser();
  const navigate = useNavigate();
  
  const [roomCode, setRoomCode] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // توليد كود عشوائي للغرفة
  useEffect(() => {
    if (currentRoom && currentRoom.roomType === 'code') {
      // إذا كان هناك كود موجود بالفعل، استخدمه
      if (currentRoom.code) {
        setGeneratedCode(currentRoom.code);
      } else {
        // توليد كود جديد
        const newCode = generateRandomCode();
        setGeneratedCode(newCode);
      }
    }
  }, [currentRoom]);
  
  // توليد كود عشوائي من 6 أحرف وأرقام
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };
  
  // نسخ كود الغرفة إلى الحافظة
  const copyRoomCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };
  
  // الانضمام إلى غرفة باستخدام الكود
  const handleJoinWithCode = (e) => {
    e.preventDefault();
    
    if (!roomCode.trim()) return;
    
    // البحث عن الغرفة بالكود
    const room = rooms.find(r => r.code === roomCode.toUpperCase());
    
    if (room) {
      joinRoom(room.id, { id: Date.now().toString(), username, status: 'waiting' });
      navigate(`/game-room/${room.id}`);
    } else {
      // إظهار رسالة خطأ
      console.error('الكود غير صحيح');
    }
  };
  
  // إنشاء رابط مباشر للغرفة الخاصة
  const generateDirectLink = () => {
    if (!currentRoom) return '';
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/game-room/${currentRoom.id}`;
  };
  
  // نسخ الرابط المباشر إلى الحافظة
  const copyDirectLink = () => {
    navigator.clipboard.writeText(generateDirectLink());
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };
  
  // تغيير نوع الغرفة (عامة/خاصة/بكود)
  const changeRoomType = (newType) => {
    if (!currentRoom) return;
    
    // تحديث نوع الغرفة في السياق
    // هذه الوظيفة يجب إضافتها إلى سياق اللعبة
    // updateRoomType(currentRoom.id, newType);
    
    // إذا كان النوع الجديد هو "بكود"، توليد كود جديد
    if (newType === 'code') {
      const newCode = generateRandomCode();
      setGeneratedCode(newCode);
    }
  };
  
  return (
    <RoomManagerContainer>
      {currentRoom ? (
        // إدارة الغرفة الحالية
        <RoomInfoCard>
          <RoomTypeSection>
            <SectionTitle>نوع الغرفة</SectionTitle>
            <RoomTypeButtons>
              <RoomTypeButton 
                active={currentRoom.roomType === 'public'}
                onClick={() => changeRoomType('public')}
              >
                <FaUsers />
                <span>عامة</span>
              </RoomTypeButton>
              
              <RoomTypeButton 
                active={currentRoom.roomType === 'code'}
                onClick={() => changeRoomType('code')}
              >
                <FaKey />
                <span>بكود</span>
              </RoomTypeButton>
              
              <RoomTypeButton 
                active={currentRoom.roomType === 'private'}
                onClick={() => changeRoomType('private')}
              >
                <FaLock />
                <span>خاصة</span>
              </RoomTypeButton>
            </RoomTypeButtons>
          </RoomTypeSection>
          
          {currentRoom.roomType === 'code' && (
            <RoomCodeSection>
              <SectionTitle>كود الغرفة</SectionTitle>
              <CodeDisplay>
                <CodeText>{generatedCode}</CodeText>
                <CopyButton onClick={copyRoomCode}>
                  {showCopiedMessage ? <FaCheck /> : <FaCopy />}
                </CopyButton>
              </CodeDisplay>
              <CodeInstructions>
                شارك هذا الكود مع أصدقائك ليتمكنوا من الانضمام إلى الغرفة.
              </CodeInstructions>
            </RoomCodeSection>
          )}
          
          {currentRoom.roomType === 'private' && (
            <DirectLinkSection>
              <SectionTitle>رابط مباشر</SectionTitle>
              <DirectLinkDisplay>
                <DirectLinkText>{generateDirectLink()}</DirectLinkText>
                <CopyButton onClick={copyDirectLink}>
                  {showCopiedMessage ? <FaCheck /> : <FaCopy />}
                </CopyButton>
              </DirectLinkDisplay>
              <LinkInstructions>
                شارك هذا الرابط مع أصدقائك ليتمكنوا من الانضمام إلى الغرفة مباشرة.
              </LinkInstructions>
            </DirectLinkSection>
          )}
          
          <RoomVisibilitySection>
            <SectionTitle>حالة الغرفة</SectionTitle>
            <VisibilityToggle>
              <VisibilityOption>
                <input 
                  type="checkbox" 
                  id="roomLocked" 
                  checked={currentRoom.locked} 
                  onChange={() => {
                    // تحديث حالة قفل الغرفة
                    // updateRoomLocked(currentRoom.id, !currentRoom.locked);
                  }} 
                />
                <VisibilityLabel htmlFor="roomLocked">
                  {currentRoom.locked ? (
                    <>
                      <FaLock />
                      <span>الغرفة مغلقة (لا يمكن انضمام لاعبين جدد)</span>
                    </>
                  ) : (
                    <>
                      <FaUnlock />
                      <span>الغرفة مفتوحة (يمكن انضمام لاعبين جدد)</span>
                    </>
                  )}
                </VisibilityLabel>
              </VisibilityOption>
            </VisibilityToggle>
          </RoomVisibilitySection>
        </RoomInfoCard>
      ) : (
        // نموذج الانضمام بكود
        <JoinWithCodeCard>
          <SectionTitle>الانضمام بكود الغرفة</SectionTitle>
          <JoinWithCodeForm onSubmit={handleJoinWithCode}>
            <CodeInput
              type="text"
              placeholder="أدخل كود الغرفة هنا..."
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <JoinButton type="submit">انضمام</JoinButton>
          </JoinWithCodeForm>
          <CodeInstructions>
            أدخل كود الغرفة الذي حصلت عليه من المضيف للانضمام إلى الغرفة.
          </CodeInstructions>
        </JoinWithCodeCard>
      )}
    </RoomManagerContainer>
  );
};

const RoomManagerContainer = styled.div`
  width: 100%;
`;

const RoomInfoCard = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const SectionTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1.2rem;
`;

const RoomTypeSection = styled.div``;

const RoomTypeButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RoomTypeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  cursor: pointer;
  transition: all var(--transition-speed);
  flex: 1;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const RoomCodeSection = styled.div``;

const CodeDisplay = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
`;

const CodeText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--text-color);
  flex: 1;
  text-align: center;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1.2rem;
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
`;

const CodeInstructions = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: var(--spacing-sm) 0 0 0;
  text-align: center;
`;

const DirectLinkSection = styled.div``;

const DirectLinkDisplay = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
`;

const DirectLinkText = styled.div`
  font-size: 0.9rem;
  color: var(--text-color);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LinkInstructions = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: var(--spacing-sm) 0 0 0;
  text-align: center;
`;

const RoomVisibilitySection = styled.div``;

const VisibilityToggle = styled.div``;

const VisibilityOption = styled.div`
  display: flex;
  align-items: center;
  
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + label {
      background-color: var(--border-color);
    }
  }
`;

const VisibilityLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color var(--transition-speed);
  
  &:hover {
    background-color: var(--border-color);
  }
  
  svg {
    color: ${props => props.checked ? 'var(--button-danger)' : 'var(--button-success)'};
  }
`;

const JoinWithCodeCard = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const JoinWithCodeForm = styled.form`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const CodeInput = styled.input`
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const JoinButton = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: var(--button-primary);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

export default RoomManager;
