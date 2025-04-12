import { Authenticated, Unauthenticated } from "convex/react";
import SignInForm from "./SignInForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <>
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </>
  );
}
