import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define the props for each category
export interface CategoryProps {
  id?: string;
  name: string;
  image: string;
}

// Dashboard component
export default function CategoriesDashboard() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CategoryProps[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing category
        const categoryRef = doc(db, "categories", editingId);
        await updateDoc(categoryRef, newCategory);
        setCategories(categories.map((cat) =>
          cat.id === editingId ? { ...cat, ...newCategory } : cat
        ));
      } else {
        // Add new category
        const docRef = await addDoc(collection(db, "categories"), newCategory);
        setCategories([...categories, { id: docRef.id, ...newCategory }]);
      }
      setNewCategory({ name: "", image: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }
  };

  const handleEdit = (category: CategoryProps) => {
    setNewCategory({ name: category.name, image: category.image });
    setEditingId(category.id || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Manage Categories</h1>

      {/* Form to Add/Edit Category */}
      <form onSubmit={handleAddOrUpdateCategory} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Category Name</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Category Image URL</label>
          <input
            type="text"
            value={newCategory.image}
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter image URL or path"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setNewCategory({ name: "", image: "" });
              setEditingId(null);
            }}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Categories List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-4 bg-white rounded-lg shadow-md relative"
          >
            <div className="relative w-full h-48 overflow-hidden rounded-md">
              <Image
                src={category.image || "/images/placeholder.jpg"}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">{category.name}</h3>
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => handleEdit(category)}
                className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id!)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}