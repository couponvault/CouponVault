'use client';

import { useState } from 'react';

interface BrandLogoProps {
    name: string;
    logo?: string;
    className?: string;
}

export default function BrandLogo({ name, logo, className = "w-full h-full object-cover" }: BrandLogoProps) {
    const [error, setError] = useState(false);

    if (logo && logo.startsWith('http') && !error) {
        return (
            <img 
                src={logo} 
                alt={name} 
                className={className} 
                onError={() => setError(true)} 
            />
        );
    }

    return (
        <span className="font-bold flex items-center justify-center w-full h-full uppercase">
            {name.charAt(0)}
        </span>
    );
}
