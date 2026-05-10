import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Pet.css';
import spriteUrl from './sprite.webp';

interface PetProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const Pet: React.FC<PetProps> = ({ containerRef }) => {
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [state, setState] = useState<'idle' | 'walk' | 'sleep' | 'wave'>('idle');
    const [isFlipped, setIsFlipped] = useState(false);
    const lastPos = useRef({ x: 100, y: 100 });

    useEffect(() => {
        const moveRandomly = () => {
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            // 隨機決定是要移動還是發呆
            const shouldMove = Math.random() > 0.4;
            
            if (shouldMove) {
                const nextX = Math.random() * (rect.width - 128);
                const nextY = Math.random() * (rect.height - 144);
                
                // 決定朝向
                setIsFlipped(nextX < pos.x);
                
                setState('walk');
                setPos({ x: nextX, y: nextY });
                
                // 移動完後回到 idle
                setTimeout(() => {
                    setState('idle');
                }, 2000);
            } else {
                setState('idle');
            }
        };

        const interval = setInterval(moveRandomly, 5000);
        return () => clearInterval(interval);
    }, [pos.x, containerRef]);

    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            initial={false}
            animate={{ 
                x: pos.x, 
                y: pos.y,
                scaleX: isFlipped ? -1 : 1
            }}
            transition={{ 
                type: "spring", 
                stiffness: 50, 
                damping: 20,
                // 當是 walk 狀態時使用較慢的移動
                duration: state === 'walk' ? 2 : 0.5 
            }}
            onDragStart={() => setState('wave')}
            onDragEnd={() => setState('idle')}
            className="absolute z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{ 
                left: 0, 
                top: 0,
                width: 128,
                height: 144
            }}
        >
            <div 
                className={`pet-container pet-${state}`} 
                style={{ backgroundImage: `url(${spriteUrl})` }}
            />
        </motion.div>
    );
};
