# 📝 Collaborative Text Editor

## 🌟 Project Overview

A modern, collaborative text editor built with React, Firebase, and ReactQuill. This web application allows users to create, edit, save, and manage documents in real-time with a clean, intuitive interface.

![Project Screenshot](/public/SS1.png)

## ✨ Features

- 📄 Real-time document editing
- 💾 Automatic cloud saving
- 📝 Rich text formatting
- 🔤 Customizable document names
- 📥 Download document functionality
- 🗑️ Document deletion
- 📱 Fully responsive design
- 🕒 Last saved timestamp

## 🚀 Technologies Used

- **Frontend**: 
  - React
  - TypeScript
  - Tailwind CSS
- **Rich Text Editor**: 
  - ReactQuill
- **Backend**: 
  - Firebase Firestore
- **Icons**: 
  - Lucide React

## 🛠️ Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- Firebase Project

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/collaborative-text-editor.git
cd collaborative-text-editor
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure Firebase
- Create a Firebase project
- Create a `firebase-config.ts` file in the `src` directory
- Add your Firebase configuration:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

4. Start the development server
```bash
npm start
# or
yarn start
```

## 🔧 Key Components

- `TextEditor`: Main component handling document editing
- Firestore integration for real-time collaboration
- Responsive design with mobile support
- Rich text formatting toolbar

## 📱 Mobile Responsiveness

The application features a fully responsive design:
- Collapsible mobile menu
- Adaptive layout
- Touch-friendly interface
- Reduced editor height on smaller screens

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Piyush Yadav - piyushkrishna11@gmail.com
