"use client";
import { useState, Suspense } from "react";
import Overlay from "@/components/login/Overlay";
import SignInForm from "@/components/login/SignInForm";
import SignUpform from "@/components/login/SignUpform";
import Loading from "@/components/Loading";

const LoginPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const handleSignUpClick = () => setIsRightPanelActive(true);
  const handleSignInClick = () => setIsRightPanelActive(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-200 max-w-[100vw] h-140 min-h-[70vh] bg-neutral-100/50 dark:bg-neutral-700 rounded-xl overflow-hidden shadow-xl">
        <Suspense fallback={<Loading />}>
          <SignInForm isActive={isRightPanelActive} />
          <SignUpform isActive={isRightPanelActive} />
          <Overlay
            isActive={isRightPanelActive}
            onSignUpClick={handleSignUpClick}
            onSignInClick={handleSignInClick}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
