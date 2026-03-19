"use client"; // Required for hooks like useState/useContext in Next.js

import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct Next.js router
import Link from 'next/link'; // For optimized footer links
import { landingPageStyles } from '@/public/assets/dummystyle';
import { Download, LayoutTemplate, Menu, X, Zap, ArrowRight } from 'lucide-react';
import { UserContext } from '@/src/context/UserContext'
import { ProfileInCard } from '../components/Cards';
import Modal from '../components/Modal';
import Login from '../components/Login';
import Signup from '../components/Signup';

const LandingPage = () => {
    const { user } = useContext(UserContext);
    const router = useRouter();
    
    const [openAuthModel, setOpenAuthModel] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    // Close mobile menu if window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCTA = () => {
        if (!user) {
            setOpenAuthModel(true);
        } else {
            router.push('/dashboard'); // Faster Next.js transition
        }
    };

    return (
        <div className={landingPageStyles.container}>
            {/* Header */}
            <header className={landingPageStyles.header}>
                <div className={landingPageStyles.headerContainer}>
                    <div className={landingPageStyles.logoContainer} onClick={() => router.push('/')}>
                        <div className={landingPageStyles.logoIcon}>
                            <LayoutTemplate className={landingPageStyles.logoIconInner}/>
                        </div>
                        <span className={landingPageStyles.logoText}>ResumeXpert</span>
                    </div>

                    {/* MOBILE MENU TOGGLE */}
                    <button className={landingPageStyles.mobileMenuButton}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* DESKTOP NAVIGATION */}
                    <div className='hidden md:flex items-center'>
                        {user ? (
                            <ProfileInCard />
                        ) : (
                            <button className={landingPageStyles.desktopAuthButton} onClick={() => setOpenAuthModel(true)}>
                                <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
                                <span className={landingPageStyles.desktopAuthButtonText}>Get Started</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MOBILE DRAWER */}
                {mobileMenuOpen && (
                    <div className={landingPageStyles.mobileMenu}>
                        <div className={landingPageStyles.mobileMenuContainer}>
                            {user ? (
                                <div className={landingPageStyles.mobileUserInfo}>
                                    <button className={landingPageStyles.mobileDashboardButton}
                                        onClick={() => {
                                            router.push('/dashboard');
                                            setMobileMenuOpen(false);
                                        }}>
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <button className={landingPageStyles.mobileAuthButton}
                                    onClick={() => {
                                        setOpenAuthModel(true);
                                        setMobileMenuOpen(false);
                                    }}>
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className={landingPageStyles.main}>
                {/* HERO SECTION - Keep your SVG and Grid as is, they are great */}
                {/* ... existing hero code ... */}
                
                {/* CTA Button Fix: Ensure z-index is correct so clicks register */}
                <button className={landingPageStyles.primaryButton} onClick={handleCTA}>
                    <div className={landingPageStyles.primaryButtonOverlay}></div>
                    <span className={landingPageStyles.primaryButtonContent} style={{ position: 'relative', zIndex: 10 }}>
                        Start Building
                        <ArrowRight className={landingPageStyles.primaryButtonIcon} size={16} />
                    </span>
                </button>
            </main>

            <footer className={landingPageStyles.footer}>
                <div className={landingPageStyles.footerContainer}>
                    <p className={landingPageStyles.footerText}>
                        Crafted with <span className={landingPageStyles.footerHeart}>❤️</span> by{' '}
                        <Link href="https://hexagondigitalservices.com/" target='_blank' className={landingPageStyles.footerLink}>
                            Hexagon Digital Services
                        </Link>
                    </p>
                </div>
            </footer>

            <Modal 
                isOpen={openAuthModel} 
                onClose={() => {
                    setOpenAuthModel(false);
                    setCurrentPage("login");
                }} 
                hideHeader
            >
                <div className="p-4">
                    {currentPage === "login" && (
                        <Login 
                            setCurrentPage={setCurrentPage} 
                            onSuccess={() => setOpenAuthModel(false)} // Pass this to close modal after login
                        />
                    )}
                    {currentPage === "signup" && (
                        <Signup 
                            setCurrentPage={setCurrentPage} 
                            onSuccess={() => setOpenAuthModel(false)} 
                        />
                    )}
                </div>
            </Modal> 
        </div>
    );
}

export default LandingPage;