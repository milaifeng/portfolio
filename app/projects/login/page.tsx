import SignInForm from "@/components/login/SignInForm";
import SignUpform from "@/components/login/SignUpform";

const loginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-[80vh] max-w-4xl h-[60vh] bg-white rounded-xl overflow-hidden  shadow-xl">
        <SignInForm />
        <SignUpform />
      </div>
    </div>
  );
};

export default loginPage;
