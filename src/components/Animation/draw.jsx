import React, {useEffect, useState} from 'react';
import './draw.css';

const Draw = () => {
    const [effects, setEffect] = useState([]);

    const handleMouseMove = (e) => {
        const newEffect = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY
        };
        setEffect((preveffects)=>[...preveffects, newEffect]);

        setTimeout(() => {
            setEffect((preveffects)=>preveffects.filter(effect => effect.id !== newEffect.id));
        }, 5000);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });

    //adding automatic hover
    useEffect(() => {
        const interval = setInterval(() => {
            const newEffect = {
                id: Date.now(),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            };
            setEffect((preveffects)=>[...preveffects, newEffect]);

            setTimeout(() => {
                setEffect((preveffects)=>preveffects.filter(effect => effect.id !== newEffect.id));
            }, 5000);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <div
            className="absolute z-0 w-screen h-screen bg-cover bg-center"
            onMouseMove={handleMouseMove}
            style={{ backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1727363542778-269c2812bb55?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
            >
            {effects.map((effect) => (
                <span
                key={effect.id}
                className="absolute rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-blue-500 animate-fade-out"
                style={{
                    width: '20px',
                    height: '20px',
                    left: effect.x - 10,
                    top: effect.y - 10,
                }}
                />
            ))}
            </div>
        );
}

export default Draw;
