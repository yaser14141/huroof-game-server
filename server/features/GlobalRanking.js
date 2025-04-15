import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaMedal, FaStar, FaChartLine, FaUserFriends, FaFilter, FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const GlobalRanking = () => {
  const { username, userId } = useUser();
  
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [timeFrame, setTimeFrame] = useState('all'); // 'all', 'month', 'week'
  const [category, setCategory] = useState('points'); // 'points', 'wins', 'accuracy'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // محاكاة استرجاع بيانات التصنيف من السيرفر
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استرجاع هذه البيانات من السيرفر
    const mockRankings = [
      {
        id: 'user1',
        username: 'أحمد',
        points: 1250,
        wins: 15,
        gamesPlayed: 20,
        correctAnswers: 45,
        totalAnswers: 50,
        accuracy: 90,
        avatar: '👨‍💻'
      },
      {
        id: 'user2',
        username: 'محمد',
        points: 980,
        wins: 12,
        gamesPlayed: 18,
        correctAnswers: 38,
        totalAnswers: 45,
        accuracy: 84,
        avatar: '👨‍🎓'
      },
      {
        id: 'user3',
        username: 'فاطمة',
        points: 1500,
        wins: 18,
        gamesPlayed: 25,
        correctAnswers: 60,
        totalAnswers: 65,
        accuracy: 92,
        avatar: '👩‍🔬'
      },
      {
        id: 'user4',
        username: 'عمر',
        points: 750,
        wins: 8,
        gamesPlayed: 15,
        correctAnswers: 30,
        totalAnswers: 40,
        accuracy: 75,
        avatar: '👨‍🚀'
      },
      {
        id: 'user5',
        username: 'سارة',
        points: 1100,
        wins: 14,
        gamesPlayed: 22,
        correctAnswers: 42,
        totalAnswers: 48,
        accuracy: 87,
        avatar: '👩‍⚕️'
      },
      {
        id: userId,
        username: username || 'أنت',
        points: 850,
        wins: 10,
        gamesPlayed: 16,
        correctAnswers: 35,
        totalAnswers: 42,
        accuracy: 83,
        avatar: '👤'
      }
    ];
    
    setRankings(mockRankings);
    
    // تحديد ترتيب المستخدم الحالي
    const userRanking = mockRankings.find(player => player.id === userId);
    if (userRanking) {
      setUserRank(userRanking);
    }
  }, [userId, username]);
  
  // فلترة وترتيب التصنيفات
  const getFilteredAndSortedRankings = () => {
    // فلترة حسب البحث
    let filtered = [...rankings];
    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // ترتيب حسب الفئة المحددة
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (category) {
        case 'points':
          valueA = a.points;
          valueB = b.points;
          break;
        case 'wins':
          valueA = a.wins;
          valueB = b.wins;
          break;
        case 'accuracy':
          valueA = a.accuracy;
          valueB = b.accuracy;
          break;
        default:
          valueA = a.points;
          valueB = b.points;
      }
      
      return sortDirection === 'desc' ? valueB - valueA : valueA - valueB;
    });
    
    return filtered;
  };
  
  // الحصول على ترتيب المستخدم الحالي
  const getCurrentUserRank = () => {
    const sortedRankings = getFilteredAndSortedRankings();
    const index = sortedRankings.findIndex(player => player.id === userId);
    return index !== -1 ? index + 1 : null;
  };
  
  // تبديل اتجاه الترتيب
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  // تغيير الفئة
  const handleCategoryChange = (newCategory) => {
    if (category === newCategory) {
      toggleSortDirection();
    } else {
      setCategory(newCategory);
      setSortDirection('desc');
    }
  };
  
  // الحصول على لون الميدالية حسب الترتيب
  const getMedalColor = (index) => {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return 'transparent';
    }
  };
  
  // الحصول على أيقونة الميدالية حسب الترتيب
  const getMedalIcon = (index) => {
    switch (index) {
      case 0: return <FaTrophy style={{ color: 'gold' }} />;
      case 1: return <FaMedal style={{ color: 'silver' }} />;
      case 2: return <FaMedal style={{ color: 'bronze' }} />;
      default: return <span>{index + 1}</span>;
    }
  };
  
  const filteredRankings = getFilteredAndSortedRankings();
  const currentUserRank = getCurrentUserRank();
  
  return (
    <RankingContainer>
      <RankingHeader>
        <RankingTitle>
          <FaTrophy />
          <span>التصنيف العالمي</span>
        </RankingTitle>
        
        <TimeFrameSelector>
          <TimeFrameOption 
            active={timeFrame === 'all'} 
            onClick={() => setTimeFrame('all')}
          >
            الكل
          </TimeFrameOption>
          <TimeFrameOption 
            active={timeFrame === 'month'} 
            onClick={() => setTimeFrame('month')}
          >
            الشهر
          </TimeFrameOption>
          <TimeFrameOption 
            active={timeFrame === 'week'} 
            onClick={() => setTimeFrame('week')}
          >
            الأسبوع
          </TimeFrameOption>
        </TimeFrameSelector>
      </RankingHeader>
      
      <UserRankCard>
        <UserRankInfo>
          <UserAvatar>{userRank?.avatar || '👤'}</UserAvatar>
          <UserDetails>
            <UserName>{userRank?.username || username || 'أنت'}</UserName>
            <UserRankText>
              الترتيب: <RankNumber>{currentUserRank || '-'}</RankNumber>
            </UserRankText>
          </UserDetails>
        </UserRankInfo>
        
        <UserStats>
          <StatItem>
            <StatValue>{userRank?.points || 0}</StatValue>
            <StatLabel>النقاط</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{userRank?.wins || 0}</StatValue>
            <StatLabel>الفوز</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{userRank?.accuracy || 0}%</StatValue>
            <StatLabel>الدقة</StatLabel>
          </StatItem>
        </UserStats>
      </UserRankCard>
      
      <FiltersContainer>
        <SearchBox>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="ابحث عن لاعب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
        
        <CategoryFilters>
          <FilterButton 
            active={category === 'points'} 
            onClick={() => handleCategoryChange('points')}
          >
            <FaStar />
            <span>النقاط</span>
            {category === 'points' && (
              <SortIcon>
                {sortDirection === 'desc' ? <FaArrowDown /> : <FaArrowUp />}
              </SortIcon>
            )}
          </FilterButton>
          
          <FilterButton 
            active={category === 'wins'} 
            onClick={() => handleCategoryChange('wins')}
          >
            <FaTrophy />
            <span>الفوز</span>
            {category === 'wins' && (
              <SortIcon>
                {sortDirection === 'desc' ? <FaArrowDown /> : <FaArrowUp />}
              </SortIcon>
            )}
          </FilterButton>
          
          <FilterButton 
            active={category === 'accuracy'} 
            onClick={() => handleCategoryChange('accuracy')}
          >
            <FaChartLine />
            <span>الدقة</span>
            {category === 'accuracy' && (
              <SortIcon>
                {sortDirection === 'desc' ? <FaArrowDown /> : <FaArrowUp />}
              </SortIcon>
            )}
          </FilterButton>
        </CategoryFilters>
      </FiltersContainer>
      
      <RankingTable>
        <TableHeader>
          <RankCell>الترتيب</RankCell>
          <PlayerCell>اللاعب</PlayerCell>
          <StatCell>النقاط</StatCell>
          <StatCell>الفوز</StatCell>
          <StatCell>الدقة</StatCell>
        </TableHeader>
        
        <TableBody>
          {filteredRankings.map((player, index) => (
            <TableRow 
              key={player.id} 
              isCurrentUser={player.id === userId}
              isTopThree={index < 3}
            >
              <RankCell>
                <RankMedal color={getMedalColor(index)}>
                  {getMedalIcon(index)}
                </RankMedal>
              </RankCell>
              
              <PlayerCell>
                <PlayerAvatar>{player.avatar}</PlayerAvatar>
                <PlayerName>{player.username}</PlayerName>
              </PlayerCell>
              
              <StatCell highlight={category === 'points'}>
                {player.points}
              </StatCell>
              
              <StatCell highlight={category === 'wins'}>
                {player.wins}
              </StatCell>
              
              <StatCell highlight={category === 'accuracy'}>
                {player.accuracy}%
              </StatCell>
            </TableRow>
          ))}
          
          {filteredRankings.length === 0 && (
            <EmptyRow>
              <EmptyMessage>لا توجد نتائج مطابقة للبحث</EmptyMessage>
            </EmptyRow>
          )}
        </TableBody>
      </RankingTable>
      
      <RankingFooter>
        <TotalPlayers>
          <FaUserFriends />
          <span>إجمالي اللاعبين: {rankings.length}</span>
        </TotalPlayers>
        
        <UpdateInfo>
          يتم تحديث التصنيف كل ساعة
        </UpdateInfo>
      </RankingFooter>
    </RankingContainer>
  );
};

const RankingContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const RankingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }
`;

const RankingTitle = styled.h3`
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

const TimeFrameSelector = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const TimeFrameOption = styled.button`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  }
`;

const UserRankCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  border-right: 4px solid var(--primary-color);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: var(--spacing-md);
  }
`;

const UserRankInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const UserAvatar = styled.div`
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color-light);
  border-radius: 50%;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const UserName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
`;

const UserRankText = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const RankNumber = styled.span`
  font-weight: 600;
  color: var(--primary-color);
`;

const UserStats = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 70px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--border-color);
  flex: 1;
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchIcon = styled.div`
  color: var(--text-secondary);
  padding: var(--spacing-sm);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: var(--spacing-sm);
  border: none;
  background: transparent;
  color: var(--text-color);
  
  &:focus {
    outline: none;
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  
  @media (max-width: 576px) {
    overflow-x: auto;
    padding-bottom: var(--spacing-xs);
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--background-color);
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: var(--border-color);
      border-radius: 20px;
    }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-speed);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const SortIcon = styled.span`
  margin-right: var(--spacing-xs);
  display: flex;
  align-items: center;
`;

const RankingTable = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1fr 1fr;
  background-color: var(--background-color);
  padding: var(--spacing-sm);
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 2px solid var(--border-color);
  
  @media (max-width: 576px) {
    grid-template-columns: 60px 2fr 1fr 1fr 1fr;
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 400px;
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

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1fr 1fr;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(-
(Content truncated due to size limit. Use line ranges to read in chunks)