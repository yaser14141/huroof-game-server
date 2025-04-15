import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const RandomDua = () => {
  const { theme } = useTheme();
  const [currentDua, setCurrentDua] = useState('');
  const [currentSource, setCurrentSource] = useState('');
  
  // قائمة الأدعية الإسلامية
  const duas = [
    {
      text: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً",
      source: "رواه ابن ماجه"
    },
    {
      text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      source: "سورة طه: 25-26"
    },
    {
      text: "اللهم لا سهل إلا ما جعلته سهلا، وأنت تجعل الحزن إذا شئت سهلا",
      source: "رواه ابن حبان"
    },
    {
      text: "اللهم إني أعوذ بك من العجز والكسل، والجبن والبخل، والهرم وعذاب القبر",
      source: "متفق عليه"
    },
    {
      text: "اللهم إني أسألك الهدى والتقى، والعفاف والغنى",
      source: "رواه مسلم"
    },
    {
      text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
      source: "رواه أبو داود"
    },
    {
      text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      source: "سورة البقرة: 201"
    },
    {
      text: "اللهم اغفر لي ذنبي، ووسع لي في داري، وبارك لي في رزقي",
      source: "رواه الترمذي"
    },
    {
      text: "اللهم إني أسألك من فضلك ورحمتك، فإنه لا يملكها إلا أنت",
      source: "رواه الترمذي"
    },
    {
      text: "اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك",
      source: "رواه مسلم"
    }
  ];
  
  // تغيير الدعاء كل 30 ثانية
  useEffect(() => {
    const getRandomDua = () => {
      const randomIndex = Math.floor(Math.random() * duas.length);
      setCurrentDua(duas[randomIndex].text);
      setCurrentSource(duas[randomIndex].source);
    };
    
    // تعيين دعاء عشوائي عند التحميل
    getRandomDua();
    
    // تغيير الدعاء كل 30 ثانية
    const interval = setInterval(() => {
      getRandomDua();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <DuaContainer>
      <DuaText>{currentDua}</DuaText>
      <DuaSource>{currentSource}</DuaSource>
    </DuaContainer>
  );
};

const DuaContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
  border-right: 3px solid var(--primary-color);
`;

const DuaText = styled.p`
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
  line-height: 1.6;
`;

const DuaSource = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
`;

export default RandomDua;
