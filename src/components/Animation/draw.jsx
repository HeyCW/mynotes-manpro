import React, { useEffect, useState } from 'react';
import './draw.css';

const Draw = ({ bgImage, inter, isMoveable, maxScale }) => {
    const [effects, setEffect] = useState([]);

    const handleMouseMove = (e) => {
        if (isMoveable) {
            const newEffect = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
                timeout: null
            };
            setEffect((preveffects) => {
                const updatedEffect = [...preveffects, newEffect]
                newEffect.timeout = setTimeout(() => {
                    setEffect((preveffects) => preveffects.filter(effect => effect.id !== newEffect.id));
                }, 5000);
                return updatedEffect;
            });

            setTimeout(() => {
                setEffect((preveffects) => preveffects.filter(effect => effect.id !== newEffect.id));
            }, 5000);
        }
    };

    useEffect(() => {
        if (isMoveable) {
            window.addEventListener('mousemove', handleMouseMove);  
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isMoveable]);



    //adding automatic hover
    useEffect(() => {
        const interval = setInterval(() => {
            const newEffect = {
                id: Date.now(),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                timeout: null
            };
            setEffect((preveffects) => {
                const updatedEffect = [...preveffects, newEffect]
                newEffect.timeout = setTimeout(() => {
                    setEffect((preveffects) => preveffects.filter(effect => effect.id !== newEffect.id));
                }, 5000);
                return updatedEffect;
            });
        }, (inter ? inter : 100));

        return () => {
            clearInterval(interval);
        };
    }, []);

    // Inject dynamic styles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fade-out {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(${maxScale? maxScale : 10});
                }
            }
            .animate-fade-out {
                animation: fade-out 5s ease-in-out forwards;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [maxScale]);


    return (
        <div
            className="fixed z-0 top-0 w-screen min-h-screen bg-cover bg-center"
            onMouseMove={handleMouseMove}
            style={{ backgroundImage: bgImage && bgImage }}
        >
            {effects.map((effect) => (
                <span
                    key={effect.id}
                    className="absolute rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 dark:bg-gradient-to-r dark:from-amber-500 dark:to-pink-500 animate-fade-out"
                    style={{
                        width: '20px',
                        height: '20px',
                        left: effect.x,
                        top: effect.y ,
                    }}
                />
            ))}
        </div>
    );
}

export default Draw;
