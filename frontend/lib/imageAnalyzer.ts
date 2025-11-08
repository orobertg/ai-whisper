/**
 * Image Analysis Utilities
 * Analyzes images to determine brightness and optimal UI theme
 */

export interface ImageAnalysis {
  brightness: number; // 0-255
  isLight: boolean; // true if light background, false if dark
}

/**
 * Analyze an image to determine its overall brightness
 * Returns a value between 0 (darkest) and 255 (brightest)
 */
export function analyzeImageBrightness(imageData: string): Promise<ImageAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas to analyze image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Scale down for faster processing (sample at 100x100)
        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        
        // Draw scaled image
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        
        // Get pixel data
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;
        
        // Calculate average brightness using luminance formula
        // Y = 0.299R + 0.587G + 0.114B (perceived brightness)
        let totalBrightness = 0;
        const pixelCount = data.length / 4; // 4 values per pixel (RGBA)
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate perceived brightness (luminance)
          const brightness = (0.299 * r) + (0.587 * g) + (0.114 * b);
          totalBrightness += brightness;
        }
        
        const averageBrightness = totalBrightness / pixelCount;
        
        // Threshold: 127.5 is middle point, but we use 140 for better results
        // (slightly favoring dark theme since most wallpapers are darker)
        const isLight = averageBrightness > 140;
        
        console.log('🎨 Image Analysis:', {
          averageBrightness: averageBrightness.toFixed(2),
          isLight,
          theme: isLight ? 'light' : 'dark'
        });
        
        resolve({
          brightness: Math.round(averageBrightness),
          isLight
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for analysis'));
    };
    
    img.src = imageData;
  });
}

/**
 * Get the appropriate UI theme based on wallpaper brightness
 */
export function getThemeForWallpaper(analysis: ImageAnalysis): 'light' | 'dark' {
  return analysis.isLight ? 'light' : 'dark';
}

