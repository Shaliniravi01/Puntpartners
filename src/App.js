import React, { useState, useEffect } from 'react';
import './App.css';
import fonts from './fonts.json'; 
import './fonts.css'; 

function App() {
  const [fontFamily, setFontFamily] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [isItalic, setIsItalic] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('textEditorSettings'));
    if (savedSettings) {
      setFontFamily(savedSettings.fontFamily);
      setFontWeight(savedSettings.fontWeight);
      setIsItalic(savedSettings.italic);
      setText(savedSettings.text);
    }
  }, []);

  useEffect(() => {
    
    const settings = {
      text,
      fontFamily,
      fontWeight,
      italic: isItalic,
    };
    localStorage.setItem('textEditorSettings', JSON.stringify(settings));
  }, [text, fontFamily, fontWeight, isItalic]);

  useEffect(() => {
    
    applyFont();
  }, [fontFamily, fontWeight, isItalic]);

  const handleFontFamilyChange = (e) => {
    const selectedFamily = e.target.value;
    setFontFamily(selectedFamily);
    setFontWeight('');
    setIsItalic(false);
  };

  const handleFontWeightChange = (e) => {
    setFontWeight(e.target.value);
  };

  const handleItalicToggle = () => {
    setIsItalic(!isItalic);
  };

  const getFontWeights = () => {
    if (fontFamily && fonts[fontFamily]) {
      return Object.keys(fonts[fontFamily]);
    }
    return [];
  };

  const getFontUrl = (selectedFamily, selectedWeight, selectedItalic) => {
    const variant = `${selectedWeight}${selectedItalic ? 'italic' : ''}`;
    return fonts[selectedFamily] ? fonts[selectedFamily][variant] : '';
  };

  const applyFont = () => {
    const editor = document.getElementById('text-editor');
    if (editor) {
      editor.style.fontFamily = fontFamily;
      editor.style.fontWeight = fontWeight;
      editor.style.fontStyle = isItalic ? 'italic' : 'normal';
    }
  };

  const handleReset = () => {
    setFontFamily('');
    setFontWeight('');
    setIsItalic(false);
    setText('');
  };

  const handleSave = () => {
    const settings = {
      text,
      fontFamily,
      fontWeight,
      italic: isItalic,
    };
    localStorage.setItem('textEditorSettings', JSON.stringify(settings));
  };

  return (
    <div>
      <i><p className="header">Text Editor<span><b>Welcome</b></span></p></i>
      <div className="editor-container">
        <div className="controls">
          <select id="font-family-selector" value={fontFamily} onChange={handleFontFamilyChange}>
            <option value="">Select Font Family</option>
            {Object.keys(fonts).map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
          <select id="font-weight-selector" value={fontWeight} onChange={handleFontWeightChange} disabled={!fontFamily}>
            <option value="">Select Font Weight</option>
            {getFontWeights().map((weight) => (
              <option key={weight} value={weight.replace('italic', '')}>
                {weight.replace('italic', '')}
              </option>
            ))}
          </select>
          <div className="toggle-button-container">
            <div
              className={`toggle-button ${isItalic ? 'active' : ''}`}
              onClick={handleItalicToggle}
              disabled={!fontFamily || !getFontWeights().some((weight) => weight.includes('italic'))}
            ></div>
            <i><label className="italic-toggle">Italic</label></i>
          </div>
        </div>
        <textarea
          id="text-editor"
          placeholder="Type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="buttons">
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
      <p className="footer">2024  ©  Punt-Partners</p>
    </div>
  );
}

export default App;
