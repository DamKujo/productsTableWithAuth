import AuthCard from "./ui/auth-card";
import { GeneralLayout } from "@/shared/layout/general-layout";

export default function Authorization() {
  return (
    <GeneralLayout>
      <div className="flex h-screen items-center justify-center">
        <AuthCard />
      </div>
    </GeneralLayout>
  );
}
