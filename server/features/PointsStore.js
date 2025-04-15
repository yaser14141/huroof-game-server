import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStore, FaCoins, FaShoppingCart, FaCheck, FaLock, FaUserCircle, FaSmile, FaMusic, FaPalette } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const PointsStore = () => {
  const { username, userId } = useUser();
  
  const [userPoints, setUserPoints] = useState(0);
  const [storeItems, setStoreItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchasedItems, setPurchasedItems] = useState([]);
  
  // محاكاة استرجاع بيانات المتجر من السيرفر
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استرجاع هذه البيانات من السيرفر
    const mockStoreItems = [
      {
        id: 'item1',
        title: 'أفاتار مميز',
        description: 'صورة رمزية خاصة تظهر بجانب اسمك',
        price: 100,
        category: 'avatar',
        image: '🧔'
      },
      {
        id: 'item2',
        title: 'رمز تعبيري خاص',
        description: 'رمز تعبيري فريد يمكنك استخدامه في الدردشة',
        price: 50,
        category: 'emoji',
        image: '🎉'
      },
      {
        id: 'item3',
        title: 'مؤثر صوتي للفوز',
        description: 'صوت خاص يُشغل عند فوزك',
        price: 150,
        category: 'sound',
        image: '🔊'
      },
      {
        id: 'item4',
        title: 'خلفية مخصصة',
        description: 'خلفية مميزة للوحة اللعب',
        price: 200,
        category: 'theme',
        image: '🎨'
      },
      {
        id: 'item5',
        title: 'لون فريق مخصص',
        description: 'لون فريد لفريقك',
        price: 300,
        category: 'theme',
        image: '🌈'
      },
      {
        id: 'item6',
        title: 'تأثير خاص للخلية',
        description: 'تأثير بصري عند احتلال خلية',
        price: 250,
        category: 'effect',
        image: '✨'
      }
    ];
    
    const mockPurchasedItems = ['item2'];
    
    setStoreItems(mockStoreItems);
    setPurchasedItems(mockPurchasedItems);
    setUserPoints(250);
  }, []);
  
  // شراء عنصر
  const purchaseItem = (itemId) => {
    const item = storeItems.find(item => item.id === itemId);
    
    if (item && userPoints >= item.price && !purchasedItems.includes(itemId)) {
      // خصم النقاط
      setUserPoints(prevPoints => prevPoints - item.price);
      
      // إضافة العنصر إلى العناصر المشتراة
      setPurchasedItems(prevItems => [...prevItems, itemId]);
      
      // في التطبيق الحقيقي، سيتم إرسال هذه البيانات إلى السيرفر
      // api.purchaseItem(userId, itemId);
    }
  };
  
  // تصفية العناصر حسب الفئة
  const filteredItems = selectedCategory === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory);
  
  // الحصول على أيقونة الفئة
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'avatar':
        return <FaUserCircle />;
      case 'emoji':
        return <FaSmile />;
      case 'sound':
        return <FaMusic />;
      case 'theme':
      case 'effect':
        return <FaPalette />;
      default:
        return <FaStore />;
    }
  };
  
  return (
    <StoreContainer>
      <StoreHeader>
        <StoreTitle>
          <FaStore />
          <span>متجر النقاط</span>
        </StoreTitle>
        <UserPoints>
          <FaCoins />
          <span>{userPoints}</span>
        </UserPoints>
      </StoreHeader>
      
      <CategoriesContainer>
        <CategoryButton 
          active={selectedCategory === 'all'} 
          onClick={() => setSelectedCategory('all')}
        >
          <FaStore />
          <span>الكل</span>
        </CategoryButton>
        
        <CategoryButton 
          active={selectedCategory === 'avatar'} 
          onClick={() => setSelectedCategory('avatar')}
        >
          <FaUserCircle />
          <span>أفاتارات</span>
        </CategoryButton>
        
        <CategoryButton 
          active={selectedCategory === 'emoji'} 
          onClick={() => setSelectedCategory('emoji')}
        >
          <FaSmile />
          <span>رموز تعبيرية</span>
        </CategoryButton>
        
        <CategoryButton 
          active={selectedCategory === 'sound'} 
          onClick={() => setSelectedCategory('sound')}
        >
          <FaMusic />
          <span>أصوات</span>
        </CategoryButton>
        
        <CategoryButton 
          active={selectedCategory === 'theme'} 
          onClick={() => setSelectedCategory('theme')}
        >
          <FaPalette />
          <span>مظاهر</span>
        </CategoryButton>
        
        <CategoryButton 
          active={selectedCategory === 'effect'} 
          onClick={() => setSelectedCategory('effect')}
        >
          <FaPalette />
          <span>تأثيرات</span>
        </CategoryButton>
      </CategoriesContainer>
      
      <ItemsGrid>
        {filteredItems.map(item => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = userPoints >= item.price;
          
          return (
            <StoreItem key={item.id} isPurchased={isPurchased}>
              <ItemImage>{item.image}</ItemImage>
              <ItemCategory>
                {getCategoryIcon(item.category)}
                <CategoryName>{item.category}</CategoryName>
              </ItemCategory>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
              
              <ItemFooter>
                <ItemPrice>
                  <FaCoins />
                  <span>{item.price}</span>
                </ItemPrice>
                
                {isPurchased ? (
                  <PurchasedButton disabled>
                    <FaCheck />
                    <span>تم الشراء</span>
                  </PurchasedButton>
                ) : canAfford ? (
                  <PurchaseButton onClick={() => purchaseItem(item.id)}>
                    <FaShoppingCart />
                    <span>شراء</span>
                  </PurchaseButton>
                ) : (
                  <LockedButton disabled>
                    <FaLock />
                    <span>نقاط غير كافية</span>
                  </LockedButton>
                )}
              </ItemFooter>
            </StoreItem>
          );
        })}
      </ItemsGrid>
      
      {filteredItems.length === 0 && (
        <NoItemsMessage>
          لا توجد عناصر في هذه الفئة حالياً
        </NoItemsMessage>
      )}
    </StoreContainer>
  );
};

const StoreContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const StoreTitle = styled.h3`
  margin: 0;
  color: var(--primary-color);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
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

const CategoriesContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-color);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 20px;
  }
`;

const CategoryButton = styled.button`
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
    font-size: 1rem;
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const StoreItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: var(--background-color);
  border: 1px solid ${props => props.isPurchased ? 'var(--button-success)' : 'var(--border-color)'};
  transition: all var(--transition-speed);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
  }
`;

const ItemImage = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--spacing-sm);
`;

const ItemCategory = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const CategoryName = styled.span`
  text-transform: capitalize;
`;

const ItemTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
`;

const ItemDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  flex: 1;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-color);
  
  svg {
    color: gold;
  }
`;

const PurchaseButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
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
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const PurchasedButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--button-success);
  color: white;
  border: none;
  cursor: not-allowed;
  font-weight: 600;
  
  svg {
    font-size: 0.9rem;
  }
`;

const LockedButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: var(--border-color);
  color: var(--text-secondary);
  border: none;
  cursor: not-allowed;
  font-weight: 600;
  
  svg {
    font-size: 0.9rem;
  }
`;

const NoItemsMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  font-style: italic;
`;

export default PointsStore;
