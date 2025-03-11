"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList, Button as ChakraButton, Avatar } from "@chakra-ui/react";
import { getUserProfile } from "@/utils/apiClients"; // Assuming getUserProfile is defined in apiClients

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const placeholderImage =
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);

    if (authToken) {
      const fetchUserProfile = async () => {
        try {
          const response = await getUserProfile();
          const { profilePicture } = response.data;
          const validProfilePicture =
            profilePicture && profilePicture.trim() !== ""
              ? profilePicture
              : placeholderImage;
          setProfilePicture(validProfilePicture);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfilePicture(placeholderImage); // Fallback to placeholder
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleRedirect = (): void => {
    router.push(isLoggedIn ? "/dashboard" : "/register");
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg')" }}
    >
      {/* Header */}
      <header className="bg-white/50 hover:bg-white/90 backdrop-blur-md shadow-md fixed top-0 w-full z-50 transition-all">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">StudyRoom</div>
          <nav className="space-x-6 flex items-center">
            <a href="/features" className="text-gray-800 hover:text-green-600 transition-all">Features</a>
            {!isLoggedIn && (
              <>
                <a href="/login" className="text-gray-800 hover:text-green-600 transition-all">Login</a>
                <a href="/register" className="text-gray-800 hover:text-green-600 transition-all">Sign Up</a>
              </>
            )}
            {isLoggedIn && (
              <Menu>
                <MenuButton>
                  <Avatar size="sm" src={profilePicture || placeholderImage} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push("/userprofile")}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-8">
          {isLoggedIn ? "Welcome Back to StudyRoom!" : "Welcome to StudyRoom!"}
        </h1>
        <p className="text-2xl mb-12 max-w-xl">
          {isLoggedIn
            ? "Access your study groups, resources, and tasks all in one place."
            : "Collaborate, learn, and grow with your peers. Create study groups, share resources, and stay organized."}
        </p>
        <ChakraButton
          onClick={handleRedirect}
          className="px-10 py-4 bg-blue-500 text-white rounded-lg text-2xl hover:bg-blue-600 shadow-lg"
        >
          {isLoggedIn ? "Dashboard" : "Register"}
        </ChakraButton>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 text-white py-4 absolute bottom-0 w-full">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; {new Date().getFullYear()} StudyRoom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
