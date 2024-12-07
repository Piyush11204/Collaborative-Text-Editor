import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  setDoc, 
  doc, 
  getDoc, 
  deleteDoc, 
  Timestamp, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { 
  Save, 
  Download, 
  Trash2, 
  Clock, 
  FileText,
  Menu,
  Edit
} from 'lucide-react';

// Custom toolbar configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

export const TextEditor: React.FC = () => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isNameEditable, setIsNameEditable] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const localChangeRef = useRef(false);

  // Generate a unique document ID or use an existing one
  const [documentId, setDocumentId] = useState<string>(() => {
    const storedDocId = localStorage.getItem('currentDocumentId');
    return storedDocId || `doc_${Date.now()}`;
  });

  // Firestore document reference
  const documentRef = doc(db, "documents", documentId);

  // Save document content
  const saveContent = () => {
    if (quillRef.current) {
      const content = quillRef.current.getEditor().getContents();
      
      setDoc(documentRef, { 
        content: content.ops, 
        name: documentName,
        updatedAt: Timestamp.now()
      }, { merge: true })
        .then(() => {
          console.log("Content Saved");
          setLastSaved(new Date());
          localChangeRef.current = false;
          localStorage.setItem('currentDocumentId', documentId);
        })
        .catch((error) => {
          console.error("Error saving content", error);
          localChangeRef.current = false;
        });
    }
  };

  // Delete current document
  const deleteDocument = async () => {
    try {
      await deleteDoc(documentRef);
      // Clear local storage and reset
      localStorage.removeItem('currentDocumentId');
      setDocumentId(`doc_${Date.now()}`);
      setDocumentName("Untitled Document");
      if (quillRef.current) {
        quillRef.current.getEditor().setText('');
      }
    } catch (error) {
      console.error("Error deleting document", error);
    }
  };

  // Download document as a text file
  const downloadDocument = () => {
    if (quillRef.current) {
      const text = quillRef.current.getEditor().getText();
      const blob = new Blob([text], { type: 'text/plain' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `${documentName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  };

  // Handle document snapshot updates
  useEffect(() => {
    const unsubscribe = onSnapshot(documentRef, (snapshot) => {
      const newContent = snapshot.data();
      if (!isEditing && quillRef.current) {
        const editor = quillRef.current.getEditor();
        const currentCursorPostion = editor.getSelection()?.index || 0;

        if (newContent) {
          editor.setContents(newContent.content || [], 'silent');
        }
        editor.setSelection(currentCursorPostion, 'silent');
      }
    });

    return () => unsubscribe();
  }, [documentRef, isEditing]);

  // Load document on component mount
  useEffect(() => {
    if (quillRef.current) {
      getDoc(documentRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            quillRef.current?.getEditor().setContents(data.content || []);
            setDocumentName(data?.name || "Untitled Document");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });

      const editor = quillRef.current.getEditor();
      const handleTextChange = () => {
        localChangeRef.current = true;
        setIsEditing(true);
        saveContent();

        // Delay resetting `isEditing` to false
        setTimeout(() => {
          setIsEditing(false);
        }, 2000);
      };

      editor.on("text-change", handleTextChange);

      return () => {
        editor.off("text-change", handleTextChange);
      };
    }
  }, [documentId]);

  const handleNameSubmit = () => {
    setIsNameEditable(false);
    saveContent(); // Save with new name
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-xl sm:rounded-xl">
      {/* Mobile Header with Responsive Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        {/* Document Name Section */}
        <div className="w-full flex justify-between items-center mb-4 sm:mb-0">
          {isNameEditable ? (
            <div className="flex items-center space-x-2 w-full">
              <input 
                type="text" 
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="text-xl sm:text-2xl font-bold w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                autoFocus
              />
              <button 
                onClick={handleNameSubmit}
                className="text-green-500 hover:text-green-700"
              >
                ✓
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold">{documentName}</h1>
              <button 
                onClick={() => setIsNameEditable(true)}
                className="text-gray-500 hover:text-gray-700"
                title="Edit Document Name"
              >
                <Edit size={16} />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors"
              title="Toggle Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Action Buttons - Responsive Layout */}
        <div className={`
          ${isMobileMenuOpen ? 'flex' : 'hidden'} 
          sm:flex 
          flex-col sm:flex-row 
          space-y-2 sm:space-y-0 
          sm:space-x-2 
          w-full sm:w-auto 
          items-stretch sm:items-center
        `}>
          <button 
            onClick={saveContent} 
            className="flex items-center justify-center text-gray-600 hover:bg-gray-100 p-3 sm:p-2 rounded transition-colors w-full sm:w-auto"
            title="Save"
          >
            <Save size={20} className="mr-2 sm:mr-0" />
            <span className="sm:hidden">Save</span>
          </button>
          <button 
            onClick={downloadDocument} 
            className="flex items-center justify-center text-gray-600 hover:bg-gray-100 p-3 sm:p-2 rounded transition-colors w-full sm:w-auto"
            title="Download"
          >
            <Download size={20} className="mr-2 sm:mr-0" />
            <span className="sm:hidden">Download</span>
          </button>
          <button 
            onClick={deleteDocument} 
            className="flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-600 p-3 sm:p-2 rounded transition-colors w-full sm:w-auto"
            title="Delete"
          >
            <Trash2 size={20} className="mr-2 sm:mr-0" />
            <span className="sm:hidden">Delete</span>
          </button>
        </div>
      </div>

      {/* Status Bar - Mobile Friendly */}
      <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4 w-full">
          {lastSaved && (
            <div className="flex items-center flex-grow">
              <Clock size={14} className="mr-2" />
              <span className="truncate">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}
          {isEditing && (
            <div className="flex items-center text-blue-600">
              <FileText size={14} className="mr-2" />
              <span>Saving...</span>
            </div>
          )}
        </div>
      </div>

      {/* Quill Editor - Responsive Height */}
      <ReactQuill 
        ref={quillRef} 
        theme="snow" 
        modules={modules}
        placeholder="Start writing your document..."
        className="h-[50vh] sm:h-[70vh] bg-white border rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default TextEditor;