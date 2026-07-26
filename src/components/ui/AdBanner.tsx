'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    slotId?: string;
    format?: 'banner' | 'square' | 'native';
    className?: string;
}

/**
 * Adsterra Ad Component
 * Usage: <AdBanner slotId="your_id_here" format="banner" />
 */
export default function AdBanner({ slotId, format = 'square', className = '' }: AdBannerProps) {
    return null;
}
