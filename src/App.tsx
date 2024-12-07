import { useEffect } from "react";
import { auth } from "./firebase-config.ts";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { TextEditor } from "../src/components/TextEditor.tsx";

function App() {
  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User is Signed in", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error", errorCode, errorMessage);
      });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is Signed in", user);
      }
    });
  }, []);

  return (
    <>
      <div className="min-h-screen fixed w-full bg-gray-100 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
          <div className="flex items-center">
            {/* Logo */}
            <img
              src="https://logos-world.net/wp-content/uploads/2022/05/Google-Docs-Logo-700x394.png"
              alt="Google Docs Logo"
              className="w-18 h-10"
            />
            <h1 className="text-xl font-medium text-gray-700">Collaborative Text Editor</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </header>

        {/* Editor Container */}
        <main className="flex-grow flex justify-center items-center p-2">
          <div className="w-full max-w-4xl bg-gray-300 shadow-lg rounded-lg ">
            <TextEditor />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
