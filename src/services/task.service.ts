import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task, TaskFormData, Subtask } from "@/types/task";

const COL = "tasks";

function fromFirestore(id: string, data: Record<string, any>): Task {
  return {
    id,
    userId: data.userId,
    title: data.title,
    description: data.description ?? "",
    priority: data.priority,
    status: data.status,
    dueDate: data.dueDate,
    subtasks: data.subtasks ?? [],
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data()));
}

export async function createTask(userId: string, data: TaskFormData): Promise<Task> {
  const ref = await addDoc(collection(db, COL), {
    userId,
    ...data,
    subtasks: data.subtasks ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    userId,
    ...data,
    subtasks: data.subtasks ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function updateSubtasks(id: string, subtasks: Subtask[]): Promise<void> {
  await updateDoc(doc(db, COL, id), { subtasks, updatedAt: serverTimestamp() });
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
