import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LoginHeader from "../login/LoginHeader";
import Footer from "../components/Footer";
import { format } from "date-fns";

function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);


  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  // Add Note
  const addNote = async () => {
    if (!newTitle.trim()) return alert("Title is required");

    try {
      await addDoc(collection(db, "notes"), {
        uid: user.uid,
        title: newTitle.trim(),
        content: newContent.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setNewTitle("");
      setNewContent("");
    } catch (e) {
      console.error(e);
      alert("Failed to add note");
    }
  };

  // Delete Note
  const removeNote = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this note!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          try {
            await deleteDoc(doc(db, "notes", id));

            swal("Note deleted successfully!", {
              icon: "success",
            });

          } catch (e) {
            console.error(e);
            swal("Error deleting note!", { icon: "error" });
          }
        } else {
          swal("Your note is safe!");
        }
      });
  };


  // Start Editing
  const startEdit = (note) => setEditingNote({ ...note });

  // Save Edit
  const saveEdit = async () => {
    if (!editingNote) return;

    try {
      await updateDoc(doc(db, "notes", editingNote.id), {
        title: editingNote.title,
        content: editingNote.content,
        updatedAt: serverTimestamp(),
      });
      setEditingNote(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-800 to-gray-950">
      <LoginHeader />

      <div className="grow p-6 max-w-3xl mx-auto w-full mt-16">
        <h1 className="text-3xl font-bold text-indigo-100 my-6 text-center">
          My Notes
        </h1>

        {/* Add Note */}
        <div className="bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] p-4 shadow rounded-lg mb-6">
          <input
            className="w-full border p-2 rounded mb-2 bg-gray-200"
            placeholder="Note title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 rounded mb-3 h-28 bg-gray-200"
            placeholder="Write something..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          ></textarea>

          <button
            onClick={addNote}
            className="bg-sky-400 text-white px-4 py-2 rounded"
          >
            Add Note
          </button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">
            No notes yet — create your first note!
          </p>
        ) : (

          <ul className="space-y-4">
            {notes.map((n) => (
              <li
                key={n.id}
                className="bg-gray-100 p-4 rounded-lg shadow border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{n.title}</h2>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap wrap-break-words break-all">
                      {(expandedNoteId === n.id || n.content.length < 200)
                        ? n.content
                        : n.content.slice(0, 200) + "..."}
                    </p>

                    {n.content.length > 200 && (
                      <button
                        onClick={() =>
                          setExpandedNoteId(expandedNoteId === n.id ? null : n.id)
                        }
                        className="text-blue-600 text-sm mt-1 underline"
                      >
                        {expandedNoteId === n.id ? "Read Less" : "Read More"}
                      </button>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {n.updatedAt?.toDate
                        ? format(n.updatedAt.toDate(), "dd MMM yyyy, HH:mm")
                        : ""}
                    </p>
                  </div>

                  <div className="flex  gap-2">
                    <button
                      onClick={() => startEdit(n)}
                      className="text-sky-400  text-xl cursor-pointerhover:underline"
                    >
                      <CiEdit />
                    </button>
                    <button
                      onClick={() => removeNote(n.id)}
                      className="text-red-500  text-xl cursor-pointer hover:underline"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-3">Edit Note</h3>

            <input
              className="w-full border p-2 rounded mb-2"
              value={editingNote.title}
              onChange={(e) =>
                setEditingNote({ ...editingNote, title: e.target.value })
              }
            />
            <textarea
              className="w-full border p-2 rounded mb-3 h-28"
              value={editingNote.content}
              onChange={(e) =>
                setEditingNote({ ...editingNote, content: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingNote(null)}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-3 py-2 bg-sky-400 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Notes;

