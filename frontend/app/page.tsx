"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

const HomePage = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div>
      <h1>Welcome to StudyRoom!</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default HomePage;
