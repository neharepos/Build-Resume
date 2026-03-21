// src/utils/colors.js
import Color from 'colorjs.io'; // Standard library for color conversion

export const fixTailwindColors = (element) => {
  const clone = element.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.width = `${element.offsetWidth}px`;
  document.body.appendChild(clone);

  const convertToRgb = (colorValue) => {
    if (!colorValue || !colorValue.includes('oklch')) return colorValue;
    try {
      // Use a real library to convert the space
      const c = new Color(colorValue);
      return c.to('srgb').toString({ format: 'rgb' });
    } catch (_e) {
      // Fallback to a safe color if conversion fails
      return 'rgb(0, 0, 0)'; 
    }
  };

  const allElements = [clone, ...clone.querySelectorAll('*')];
  
  allElements.forEach(el => {
    const computed = window.getComputedStyle(el);
    
    // Check and fix the three main color properties
    const props = ['backgroundColor', 'color', 'borderColor'];
    props.forEach(prop => {
      if (computed[prop].includes('oklch')) {
        el.style[prop] = convertToRgb(computed[prop]);
      }
    });
  });

  // IMPORTANT: Remember to remove this clone after the PDF is generated!
  // You should handle the removal in the calling function: clone.remove();
  
  return clone;
};