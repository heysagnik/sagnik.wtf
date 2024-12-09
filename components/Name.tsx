import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Name: React.FC = () => {
    return (
        <div>
            <h1 className="font-medium pt-12 text-2xl transition-element">
                <span className="sr-only">Sagnik Sahoo</span>
                <span aria-hidden="true" className="block overflow-hidden group relative">
                    <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
                        {'Sagnik Sahoo'.split('').map((letter, index) => (
                            <span
                                key={index}
                                className="inline-block"
                                style={{ transitionDelay: `${index * 25}ms` }}
                            >
                                {letter === ' ' ? '\u00A0' : letter}
                            </span>
                        ))}
                    </span>
                    <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
                        {'heysagnik'.split('').map((letter, index) => (
                            <span
                                key={index}
                                className="inline-block"
                                style={{ transitionDelay: `${index * 25}ms` }}
                            >
                                {letter}
                            </span>
                        ))}
                    </span>
                </span>
            </h1>
            <div className="flex items-center space-x-2 mt-2">
                <span>
                    <img
                        src="/beach-emoji.png" 
                        alt="Beach emoji"
                        className="h-5 w-5"
                      
                    />
                </span>
                <p className="text-gray-500">
                    <i>vibing with exams</i>
                </p>
            </div>
        </div>
    );
};

// Export as default
export default Name;

// Optional: Named export for animated version
export const AnimatedName: React.FC = () => {
    return (
        <Link href="/" className="flex mb-8 font-medium text-gray-400 fade-in">
            Sagnik Sahoo
        </Link>
    );
};