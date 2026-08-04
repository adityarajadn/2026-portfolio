"use client";

import React, { useEffect, useRef } from 'react';

export interface ShapeGridProps {
  speed?: number;
  squareSize?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal';
  borderColor?: string;
  hoverFillColor?: string;
  shape?: 'square' | 'hexagon' | 'circle' | 'triangle';
  hoverTrailAmount?: number;
}

export default function ShapeGrid({
  speed = 0.5,
  squareSize = 40,
  direction = 'diagonal',
  borderColor = '#2F293A',
  hoverFillColor = '#222222',
  shape = 'square',
  hoverTrailAmount = 0
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offsetX = 0;
    let offsetY = 0;
    
    // Mouse hover tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const hoveredCells = new Map<string, number>();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, type: string) => {
      ctx.beginPath();
      switch (type) {
        case 'square':
          ctx.rect(x, y, size, size);
          break;
        case 'circle':
          ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          break;
        case 'triangle':
          ctx.moveTo(x + size / 2, y);
          ctx.lineTo(x + size, y + size);
          ctx.lineTo(x, y + size);
          ctx.closePath();
          break;
        case 'hexagon':
          const hexH = size / 2;
          const hexW = size * 0.433;
          ctx.moveTo(x + size / 2, y);
          ctx.lineTo(x + size / 2 + hexW, y + hexH / 2);
          ctx.lineTo(x + size / 2 + hexW, y + size - hexH / 2);
          ctx.lineTo(x + size / 2, y + size);
          ctx.lineTo(x + size / 2 - hexW, y + size - hexH / 2);
          ctx.lineTo(x + size / 2 - hexW, y + hexH / 2);
          ctx.closePath();
          break;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update offset based on direction
      if (direction === 'diagonal') {
        offsetX -= speed;
        offsetY -= speed;
      } else if (direction === 'up') {
        offsetY -= speed;
      } else if (direction === 'down') {
        offsetY += speed;
      } else if (direction === 'left') {
        offsetX -= speed;
      } else if (direction === 'right') {
        offsetX += speed;
      }

      // Loop offsets to create infinite scroll
      let activeOffsetX = offsetX % squareSize;
      let activeOffsetY = offsetY % squareSize;

      const cols = Math.ceil(canvas.width / squareSize) + 2;
      const rows = Math.ceil(canvas.height / squareSize) + 2;

      // Track newly hovered cell (need to account for the grid shift relative to static mouse)
      const absGridX = Math.floor((mouseX - activeOffsetX) / squareSize);
      const absGridY = Math.floor((mouseY - activeOffsetY) / squareSize);
      
      // We encode the cell position using an absolute conceptual coordinate system that shifts with the grid
      const gridConceptX = Math.floor((mouseX - offsetX) / squareSize);
      const gridConceptY = Math.floor((mouseY - offsetY) / squareSize);
      
      const cellKey = `${gridConceptX},${gridConceptY}`;
      
      if (mouseX >= 0 && mouseY >= 0) {
        hoveredCells.set(cellKey, Date.now());
      }

      // Render grid
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * squareSize + activeOffsetX;
          const y = j * squareSize + activeOffsetY;
          
          // Absolute grid position corresponding to this drawn cell
          const baseI = i + Math.floor(-offsetX / squareSize);
          const baseJ = j + Math.floor(-offsetY / squareSize);
          const key = `${baseI},${baseJ}`;
          
          let alpha = 0;
          if (hoveredCells.has(key)) {
            const timeSinceHover = Date.now() - hoveredCells.get(key)!;
            const duration = (hoverTrailAmount + 1) * 300; // time it stays visible
            if (timeSinceHover < duration) {
              alpha = 1 - (timeSinceHover / duration);
            } else {
              hoveredCells.delete(key);
            }
          }

          if (alpha > 0) {
            ctx.fillStyle = hoverFillColor;
            ctx.globalAlpha = alpha;
            drawShape(ctx, x, y, squareSize, shape);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          drawShape(ctx, x, y, squareSize, shape);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor, shape, hoverTrailAmount]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0" 
      style={{ background: 'transparent' }} 
    />
  );
}
