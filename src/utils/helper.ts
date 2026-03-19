import html2canvas from "html2canvas";
import moment from "moment";

/**
 * Validate email format.
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Format "YYYY-MM" → "MMM YYYY" (e.g. "2025-03" → "Mar 2025").
 */
export function formatYearMonth(yearMonth) {
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

/**
 * Fix Tailwind v4 oklch colors for html2canvas.
 * Instead of making everything black, it now attempts to use a safe 
 * grayscale fallback so the design structure remains visible.
 */
export const fixTailwindColors = (rootElement) => {
  if (!rootElement) return;
  const elements = [rootElement, ...rootElement.querySelectorAll("*")];
  
  elements.forEach((el) => {
    const style = window.getComputedStyle(el);
    const colorProps = ["color", "backgroundColor", "borderColor"];
    
    colorProps.forEach((prop) => {
      const val = style[prop] || "";
      if (val.includes("oklch")) {
        // Fallback to a neutral dark gray for text, or light gray for backgrounds
        if (prop === "color") el.style[prop] = "#374151"; 
        else if (prop === "backgroundColor") el.style[prop] = "#f3f4f6";
        else el.style[prop] = "#d1d5db";
      }
    });

    // Handle SVGs specifically
    if (el instanceof SVGElement) {
      ["fill", "stroke"].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val && val.includes("oklch")) {
          el.setAttribute(attr, "#4b5563");
        }
      });
    }
  });
};

/**
 * Captures a DOM element (your Resume) as a high-quality PNG.
 * Perfect for generating Dashboard thumbnails.
 */
export async function captureElementAsImage(element) {
  if (!element) throw new Error("No element provided");

  // 1. Clone & position off-screen
  const clone = element.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.top = "-9999px";
  clone.style.left = "0";
  // We use visibility:visible but hidden from user view to ensure capture works
  clone.style.opacity = "1"; 
  
  const { width, height } = element.getBoundingClientRect();
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  document.body.appendChild(clone);

  // 2. Fix colors on the clone before rendering
  fixTailwindColors(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution for thumbnails
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
    });
    
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Capture failed:", error);
    throw error;
  } finally {
    // 3. Cleanup: Remove the clone from the DOM
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}

/**
 * Helper to get the dominant light color from an image.
 */
export const getLightColorFromImage = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl || typeof imageUrl !== "string") return resolve("#ffffff");

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 10; // Small size for performance
      canvas.height = 10;
      ctx.drawImage(img, 0, 0, 10, 10);

      const data = ctx.getImageData(0, 0, 10, 10).data;
      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        if (brightness > 150) { // Only count light pixels
          r += data[i]; g += data[i+1]; b += data[i+2];
          count++;
        }
      }
      if (count === 0) resolve("#ffffff");
      else resolve(`rgb(${Math.round(r/count)}, ${Math.round(g/count)}, ${Math.round(b/count)})`);
    };

    img.onerror = () => resolve("#ffffff");
    img.src = imageUrl;
  });
};

/**
 * Convert DataURL to File object for uploading to your Backend.
 */
export const dataURLtoFile = (dataUrl, fileName) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};