import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'secondary';
    fullScreen?: boolean;
    message?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}