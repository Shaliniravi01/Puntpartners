import React, { useState, useEffect } from 'react';
import './App.css';
import fonts from './fonts.json'; // Ensure your fonts.json is correctly placed in the src folder

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

  const handleFontFamilyChange = (e) => {
    const selectedFamily = e.target.value;
    setFontFamily(selectedFamily);
    const closestVariant = findClosestVariant(selectedFamily, fontWeight, isItalic);
    setFontWeight(closestVariant.weight);
    setIsItalic(closestVariant.italic);
  };

  const handleFontWeightChange = (e) => {
    setFontWeight(e.target.value);
  };

  const handleItalicToggle = () => {
    setIsItalic(!isItalic);
  };

  const findClosestVariant = (selectedFamily, currentWeight, currentItalic) => {
    const variants = fonts[selectedFamily] || {};
    const availableWeights = Object.keys(variants);

    let closestWeight = '';
    let closestItalic = false;

    // Check if the exact variant exists
    const exactVariant = `${currentWeight}${currentItalic ? 'italic' : ''}`;
    if (variants.hasOwnProperty(exactVariant)) {
      return { weight: currentWeight, italic: currentItalic };
    }

    // Find closest italic variant
    if (currentItalic) {
      closestWeight = availableWeights.find(weight => weight.includes('italic')) || '';
      if (closestWeight) {
        return { weight: closestWeight.replace('italic', ''), italic: true };
      }
    }

    // Find closest weight
    closestWeight = availableWeights.length ? availableWeights[0].replace('italic', '') : '';
    return { weight: closestWeight, italic: false };
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
    const fontUrl = getFontUrl(fontFamily, fontWeight, isItalic);
    if (fontUrl) {
      let link = document.getElementById('font-link');
      if (!link) {
        link = document.createElement('link');
        link.id = 'font-link';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = fontUrl;
    }
    const editor = document.getElementById('text-editor');
    editor.style.fontFamily = fontFamily;
    editor.style.fontWeight = fontWeight;
    editor.style.fontStyle = isItalic ? 'italic' : 'normal';
  };

  useEffect(() => {
    applyFont();
  }, [fontFamily, fontWeight, isItalic]);

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
    
      <i><p className="header">Text Editor</p></i>
      <center>
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
          style={{ fontFamily, fontWeight, fontStyle: isItalic ? 'italic' : 'normal' }}
        ></textarea>
        <div className="buttons">
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
      <p className="footer"> 2024 © All rights received.</p>
      </center>
    </div>
  );
}

export default App;
