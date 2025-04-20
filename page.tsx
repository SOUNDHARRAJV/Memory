"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Track registration state
  const [media, setMedia] = useState<File | null>(null);
  const { toast } = useToast();
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]); // URLs of uploaded media

  useEffect(() => {
    // Simulate checking local storage or cookies for authentication
    const storedAuth = localStorage.getItem("isLoggedIn");
    if (storedAuth === "true") {
      setIsLoggedIn(true);
      // Load media on login
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const storedMedia = localStorage.getItem(`${loggedInUser}-media`);
        if (storedMedia) {
          setUploadedMedia(JSON.parse(storedMedia));
        }
      }
    }
  }, []);

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      toast({
        title: "Login Error",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }

    const storedPassword = localStorage.getItem(username);

    // Simulate authentication
    if (storedPassword && storedPassword === password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", username);
      setIsLoggedIn(true);
      // Load media on login
      const storedMedia = localStorage.getItem(`${username}-media`);
      if (storedMedia) {
        setUploadedMedia(JSON.parse(storedMedia));
      }
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    // Simulate registration
    if (!username || !password) {
      toast({
        title: "Registration Error",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }

    // Basic check if username already exists (replace with actual database check)
    if (localStorage.getItem(username)) {
      toast({
        title: "Registration Error",
        description:
          "Username already exists. Please choose a different one.",
        variant: "destructive",
      });
      return;
    }

    // Simulate successful registration
    localStorage.setItem(username, password); // Store username and password
    toast({
      title: "Registration Successful",
      description: "You have successfully registered. Please log in.",
    });
    setIsRegistering(false); // Switch back to login form
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUploadedMedia([]); // Clear media on logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleMediaUpload = async () => {
    if (!media) {
      toast({
        title: "Upload Error",
        description: "No media selected.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload (store in local storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      const mediaUrl = reader.result as string;
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const storedMedia = localStorage.getItem(`${loggedInUser}-media`);
        let mediaArray = storedMedia ? JSON.parse(storedMedia) : [];
        mediaArray.push(mediaUrl);
        localStorage.setItem(`${loggedInUser}-media`, JSON.stringify(mediaArray));
        setUploadedMedia(mediaArray);
      }
      setMedia(null); // Reset selected media
      toast({
        title: "Media Upload",
        description: `${media.name} uploaded successfully!`,
      });
    };
    reader.readAsDataURL(media);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setMedia(files[0]);
    }
  };

  const handleDeleteMedia = (index: number) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const storedMedia = localStorage.getItem(`${loggedInUser}-media`);
      if (storedMedia) {
        let mediaArray = JSON.parse(storedMedia);
        mediaArray.splice(index, 1); // Remove the media at the given index
        localStorage.setItem(`${loggedInUser}-media`, JSON.stringify(mediaArray));
        setUploadedMedia([...mediaArray]); // Update state to re-render
        toast({
          title: "Media Deleted",
          description: "Media deleted successfully!",
        });
      }
    }
  };

  const handleShareMedia = (url: string, platform: string) => {
    let shareURL = "";
    switch (platform) {
      case "whatsapp":
        shareURL = `https://wa.me/?text=${encodeURIComponent(
          "Check out this media: " + url
        )}`;
        break;
      case "facebook":
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          "Check out this media"
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "instagram":
        // Instagram sharing is not directly supported via URL.
        // You might open a new tab with a message to manually share.
        window.open(
          "https://www.instagram.com/",
          "_blank"
        );
        toast({
          title: "Share on Instagram",
          description:
            "Please share manually by downloading the image and posting on Instagram.",
        });
        return; // Early return to avoid default clipboard message.
      case "email":
        shareURL = `mailto:?subject=Shared Media&body=${encodeURIComponent(
          "Check out this media: " + url
        )}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast({
          title: "Media Shared",
          description: "Media URL copied to clipboard!",
        });
        return; // Early return to avoid default clipboard message.
    }

    window.open(shareURL, "_blank");
    toast({
      title: "Media Shared",
      description: `Shared on ${platform}!`,
    });
  };

  // Conditional rendering based on login status
  if (!isLoggedIn) {
    return (
        <div className="login-register-container">
            <Card className="login-register-card">
                <CardContent>
                    <h2>{isRegistering ? "Register" : "Login"}</h2>
                    {isRegistering ? (
                        <>
                            <div className="input-field">
                                <label htmlFor="register-username">Username:</label>
                                <Input
                                    type="text"
                                    id="register-username"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="register-password">Password:</label>
                                <Input
                                    type="password"
                                    id="register-password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleRegister}>Register</Button>
                            <div className="toggle-form">
                                <a href="#" onClick={() => setIsRegistering(false)}>
                                    Already have an account? Login
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-field">
                                <label htmlFor="login-username">Username:</label>
                                <Input
                                    type="text"
                                    id="login-username"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="login-password">Password:</label>
                                <Input
                                    type="password"
                                    id="login-password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleLogin}>Login</Button>
                            <div className="toggle-form">
                                <a href="#" onClick={() => setIsRegistering(true)}>
                                    New to MemoryVault? Register
                                </a>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
  }

  // Main application UI when logged in
  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">MemoryVault</h1>
      <Button onClick={handleLogout} className="mb-4">
        Logout
      </Button>

      {/* Media Upload */}
      <div
        className="upload-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("media-upload")?.click()}
      >
        {media ? (
          <div className="flex items-center justify-center">
            <Icons.camera className="h-4 w-4 mr-2" />
            <span>{media.name}</span>
          </div>
        ) : (
          <>
            <Icons.upload className="h-6 w-6 mx-auto mb-2" />
            <span>Drag and drop media here or click to select</span>
          </>
        )}
        <input
          type="file"
          id="media-upload"
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setMedia(files[0]);
            }
          }}
        />
      </div>

      <Button onClick={handleMediaUpload} disabled={!media} className="mt-4">
        Upload Media
      </Button>

      {/* Media Display (Google Photos-like) */}
      <div className="photos-grid">
        {uploadedMedia.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Uploaded media ${index + 1}`}
              className="rounded-md shadow-md w-full h-auto aspect-video object-cover"
            />
            <div className="absolute top-2 right-2 flex">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-1 rounded-full bg-white/80 hover:bg-white"
                  >
                    <Icons.share className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShareMedia(url, "whatsapp")}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShareMedia(url, "email")}
                  >
                    Email
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShareMedia(url, "facebook")}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShareMedia(url, "instagram")}
                  >
                    Instagram
                  </Button>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-1 rounded-full bg-white/80 hover:bg-white"
                onClick={() => handleDeleteMedia(index)}
              >
                <Icons.trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
