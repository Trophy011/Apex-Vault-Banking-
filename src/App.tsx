import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase.ts';
import { bankStore, ADMIN_EMAIL } from './lib/bankStore.ts';
import { BankUser } from './lib/types.ts';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { SupportChatWidget } from './components/SupportChatWidget.tsx';
import { navHistory } from './lib/navHistory.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<BankUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [supportChatOpen, setSupportChatOpen] = useState(false);

  // Browser back / forward smooth navigation for Auth Modal
  useEffect(() => {
    if (authModalOpen) {
      navHistory.pushModal('auth_modal', () => setAuthModalOpen(false));
      return () => navHistory.closeModal('auth_modal');
    }
  }, [authModalOpen]);

  // Check persistent session
  useEffect(() => {
    const savedUserJson = sessionStorage.getItem('apex_current_user_v3');
    if (savedUserJson) {
      try {
        const u = JSON.parse(savedUserJson);
        const refreshed = bankStore.getUser(u.uid);
        if (refreshed) {
          setCurrentUser(refreshed);
        } else {
          setCurrentUser(u);
          // Try async cloud fetch
          bankStore.fetchUserByEmailAsync(u.email).then(cloudUser => {
            if (cloudUser) setCurrentUser(cloudUser);
          }).catch(() => {});
        }
      } catch {}
    }

    // Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser && firebaseUser.email) {
        const email = firebaseUser.email.toLowerCase();
        let bankUser = bankStore.getUserByEmail(email);
        if (!bankUser) {
          bankUser = await bankStore.fetchUserByEmailAsync(email);
        }
        if (!bankUser) {
          bankUser = bankStore.registerUser(
            email,
            firebaseUser.displayName || email.split('@')[0],
            firebaseUser.uid
          );
        }
        if (email === ADMIN_EMAIL.toLowerCase()) {
          bankStore.updateUserProfile(bankUser.uid, { role: 'admin' });
        }
        setCurrentUser(bankUser);
        sessionStorage.setItem('apex_current_user_v3', JSON.stringify(bankUser));
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization across devices
  useEffect(() => {
    const unsubscribe = bankStore.subscribe(() => {
      if (currentUser) {
        const refreshed = bankStore.getUser(currentUser.uid);
        if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(currentUser)) {
          setCurrentUser(refreshed);
          sessionStorage.setItem('apex_current_user_v3', JSON.stringify(refreshed));
        }
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleLoginSuccess = (user: BankUser) => {
    setCurrentUser(user);
    sessionStorage.setItem('apex_current_user_v3', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    sessionStorage.removeItem('apex_current_user_v3');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {currentUser ? (
        currentUser.role === 'admin' ? (
          <AdminPortal onLogout={handleLogout} />
        ) : (
          <CustomerDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenSupport={() => setSupportChatOpen(true)}
          />
        )
      ) : (
        <LandingPage onOpenAuth={handleOpenAuth} />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        defaultMode={authModalMode}
      />

      {/* 24/7 Support Chat Widget for Visitors & Customers */}
      {(!currentUser || currentUser.role !== 'admin') && (
        <SupportChatWidget
          currentUserId={currentUser ? currentUser.uid : 'guest-visitor'}
          currentUserEmail={currentUser ? currentUser.email : 'visitor@apexbank.com'}
          currentUserName={currentUser ? currentUser.displayName : 'Guest Visitor'}
          isOpenControlled={supportChatOpen}
          onOpenControlled={() => setSupportChatOpen(true)}
          onCloseControlled={() => setSupportChatOpen(false)}
        />
      )}
    </div>
  );
}
