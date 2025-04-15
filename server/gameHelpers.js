// utils/gameHelpers.js
// وظائف مساعدة للعبة

/**
 * إنشاء شبكة سداسية من الحروف العربية
 * @param {number} rows عدد الصفوف
 * @param {number} cols عدد الأعمدة
 * @param {Array} letters قائمة الحروف المتاحة
 * @returns {Object} شبكة سداسية من الحروف
 */
function generateHexGrid(rows = 5, cols = 5, letters) {
  const grid = {};
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${r}-${c}`;
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      
      let type = 'inner';
      if (isEdge) {
        if (r === 0 || r === rows - 1) {
          type = 'top-edge';
        } else {
          type = 'side-edge';
        }
      }
      
      grid[id] = {
        id,
        row: r,
        col: c,
        letter: isEdge ? '' : getRandomLetter(letters),
        type,
        owner: null
      };
    }
  }
  
  return grid;
}

/**
 * الحصول على حرف عشوائي من قائمة الحروف
 * @param {Array} letters قائمة الحروف المتاحة
 * @returns {string} حرف عشوائي
 */
function getRandomLetter(letters) {
  const index = Math.floor(Math.random() * letters.length);
  return letters[index];
}

/**
 * إعادة ترتيب الحروف في الشبكة السداسية
 * @param {Object} grid الشبكة السداسية الحالية
 * @param {Array} letters قائمة الحروف المتاحة
 * @returns {Object} الشبكة السداسية بعد إعادة ترتيب الحروف
 */
function shuffleHexGrid(grid, letters) {
  const newGrid = { ...grid };
  
  for (const cellId in newGrid) {
    const cell = newGrid[cellId];
    if (cell.type === 'inner') {
      cell.letter = getRandomLetter(letters);
    }
  }
  
  return newGrid;
}

/**
 * تغيير ألوان الفرق في الشبكة السداسية
 * @param {Object} grid الشبكة السداسية الحالية
 * @param {Object} teamColors ألوان الفرق
 * @returns {Object} الشبكة السداسية بعد تغيير الألوان
 */
function updateTeamColors(grid, teamColors) {
  const newGrid = { ...grid };
  
  for (const cellId in newGrid) {
    const cell = newGrid[cellId];
    if (cell.owner) {
      cell.color = teamColors[cell.owner];
    }
  }
  
  return newGrid;
}

/**
 * التحقق من الفوز في اللعبة
 * @param {Object} grid الشبكة السداسية الحالية
 * @returns {Object} نتيجة التحقق من الفوز
 */
function checkWinCondition(grid) {
  let team1Count = 0;
  let team2Count = 0;
  let totalCells = 0;
  
  for (const cellId in grid) {
    const cell = grid[cellId];
    if (cell.type === 'inner') {
      totalCells++;
      if (cell.owner === 'team1') {
        team1Count++;
      } else if (cell.owner === 'team2') {
        team2Count++;
      }
    }
  }
  
  // التحقق من الفوز إذا استحوذ فريق على أكثر من 60% من الخلايا
  const team1Percentage = (team1Count / totalCells) * 100;
  const team2Percentage = (team2Count / totalCells) * 100;
  
  if (team1Percentage >= 60) {
    return { winner: 'team1', team1Count, team2Count, team1Percentage, team2Percentage };
  } else if (team2Percentage >= 60) {
    return { winner: 'team2', team1Count, team2Count, team1Percentage, team2Percentage };
  }
  
  return { winner: null, team1Count, team2Count, team1Percentage, team2Percentage };
}

module.exports = {
  generateHexGrid,
  getRandomLetter,
  shuffleHexGrid,
  updateTeamColors,
  checkWinCondition
};
