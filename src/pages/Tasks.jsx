import React, { useEffect, useState } from "react";
import LoginHeader from "../login/LoginHeader";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Footer from "../components/Footer";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

function Task() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDue, setNewDue] = useState(""); // ISO date string
  const [newPriority, setNewPriority] = useState("low");

  // editing
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all"); // all | pending | completed
  // newest | oldest | due

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    // query tasks for user, order by createdAt desc by default
    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Add task
  const handleAdd = async () => {
    if (!user) return alert("Please login to add tasks");
    if (!newTitle.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        uid: user.uid,
        title: newTitle.trim(),
        description: newDesc.trim() || "",
        completed: false,
        dueAt: newDue ? new Date(newDue) : null,
        priority: newPriority,
        createdAt: serverTimestamp(),
      });
      // schedule notification for due date (local)
      if (newDue) scheduleLocalReminder(new Date(newDue), newTitle);
      setNewTitle("");
      setNewDesc("");
      setNewDue("");
      setNewPriority("low");
    } catch (err) {
      console.error("add task error", err);
      alert("Failed to add task");
    }
  };

  // Delete
  const handleDelete = async (id) => {
  const willDelete = await swal({
    title: "Are you sure?",
    text: "Once deleted, you cannot recover this task!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });

  if (!willDelete) {
    return swal("Your task is safe!");
  }

  try {
    await deleteDoc(doc(db, "tasks", id));
    swal("Task deleted!", { icon: "success" });
  } catch (err) {
    console.error("delete task", err);
    swal("Error deleting task!", { icon: "error" });
  }
};


  // Toggle complete
  const toggleComplete = async (id, completed) => {
    try {
      await updateDoc(doc(db, "tasks", id), { completed: !completed });
    } catch (err) {
      console.error("toggle complete", err);
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditingTask({
      ...task,
      dueAtISO: task.dueAt ? toInputDate(task.dueAt.toDate ? task.dueAt.toDate() : new Date(task.dueAt)) : "",
    });
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingTask) return;
    const { id, title, description, dueAtISO, priority } = editingTask;
    try {
      await updateDoc(doc(db, "tasks", id), {
        title: title.trim(),
        description: description.trim(),
        dueAt: dueAtISO ? new Date(dueAtISO) : null,
        priority,
      });
      setEditingTask(null);
    } catch (err) {
      console.error("update task", err);
    }
  };

  // Cancel edit
  const cancelEdit = () => setEditingTask(null);

  // Helpers: formatting
  const toInputDate = (d) => {
    // convert Date -> yyyy-MM-ddTHH:mm
    if (!d) return "";
    const iso = new Date(d).toISOString();
    return iso.slice(0, 16);
  };

  const displayDue = (d) => {
    if (!d) return "No due date";
    const dateObj = d.toDate ? d.toDate() : new Date(d);
    return format(dateObj, "dd MMM yyyy, HH:mm");
  };

  // Filtering & Sorting
  const filtered = tasks
    .filter((t) =>
      filter === "all" ? true : filter === "pending" ? !t.completed : t.completed
    )
    ;

  // Local reminders using Notification API
  async function scheduleLocalReminder(dueDate, title) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") return;
    const ms = dueDate.getTime() - Date.now();
    if (ms <= 0) return; // past
    // schedule a timeout (note: won't survive reloads)
    setTimeout(() => {
      new Notification("Task due: " + title, {
        body: `Your task "${title}" is due now.`,
      });
    }, ms);
  }

  // When component mounts, ask notification permission (optional)
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      // ask once when the user first opens tasks
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-800 to-gray-950">
      <LoginHeader />

      <div className="grow mt-16 p-6 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white my-6 text-center">My Tasks</h1>

        {/* Add form */}
        <div className="bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="p-2 border rounded bg-gray-300"
            />
            <input
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              type="datetime-local"
              className="p-2 border rounded bg-gray-300"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="p-2 border rounded bg-gray-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full mt-3 p-2 border rounded bg-gray-300"
          />

          <div className="flex justify-end mt-3">
            <button onClick={handleAdd} className="bg-sky-400 hover:bg-sky-600 text-white px-4 py-2 rounded cursor-pointer">
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex gap-2">
            <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded ${filter === "all" ? "bg-gray-200 text-black" : "bg-transparent text-white border"} cursor-pointer`}>All</button>
            <button onClick={() => setFilter("pending")} className={`px-3 py-1 rounded ${filter === "pending" ? "bg-gray-200 text-black" : "bg-transparent text-white border"} cursor-pointer`}>Pending</button>
            <button onClick={() => setFilter("completed")} className={`px-3 py-1 rounded ${filter === "completed" ? "bg-gray-200 text-black" : "bg-transparent text-white border"} cursor-pointer`}>Completed</button>
          </div>

          
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet — start adding!</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((t) => (
              <li key={t.id} className="bg-gray-100 p-4 rounded-lg shadow flex items-start justify-between border">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={!!t.completed} onChange={() => toggleComplete(t.id, t.completed)}  className="cursor-pointer"/>
                    <div>
                      <div className={`${t.completed ? "line-through text-gray-600" : "text-black"} font-semibold text-2xl`} >{t.title}</div>
                      <div className=" text-gray-800">{t.description}</div>
                      <div className="text-sm text-gray-600 mt-1">{t.dueAt ? displayDue(t.dueAt) : "No due date"} • Priority: {t.priority}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-2 ml-4">
                  <button onClick={() => startEdit(t)} className="text-sky-400 hover:underline text-xl cursor-pointer"><CiEdit /></button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:underline text-xl cursor-pointer"><MdDelete /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-3">Edit Task</h3>

            <input
              className="w-full p-2 border rounded mb-2"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            />
            <input
              type="datetime-local"
              className="w-full p-2 border rounded mb-2"
              value={editingTask.dueAtISO || ""}
              onChange={(e) => setEditingTask({ ...editingTask, dueAtISO: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded mb-4"
              value={editingTask.priority}
              onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={cancelEdit} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={saveEdit} className="px-3 py-2 bg-sky-400 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Task;