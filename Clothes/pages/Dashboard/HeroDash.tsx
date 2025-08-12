"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Input, Button, Switch, Select, SelectItem, Spinner } from "@nextui-org/react"
import { motion } from "framer-motion"

interface HeroItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  order: number
  active: boolean
  createdAt?: any
  updatedAt?: any
}

export default function HeroDashboard() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState<Partial<HeroItem>>({
    type: "image",
    url: "",
    title: "",
    description: "",
    order: 0,
    active: true,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchHeroItems()
  }, [])

  const fetchHeroItems = async () => {
    try {
      setLoading(true)
      const heroItemsRef = collection(db, "heroContent")
      const q = query(heroItemsRef, orderBy("order", "asc"))
      const querySnapshot = await getDocs(q)
      const heroItemsData: HeroItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<HeroItem, "id">),
      }))
      setHeroItems(heroItemsData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching hero items:", error)
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    try {
      setIsAdding(true)
      const heroItemsRef = collection(db, "heroContent")
      await addDoc(heroItemsRef, {
        ...newItem,
        order: heroItems.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setNewItem({
        type: "image",
        url: "",
        title: "",
        description: "",
        order: 0,
        active: true,
      })
      await fetchHeroItems()
    } catch (error) {
      console.error("Error adding hero item:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateItem = async (id: string, updates: Partial<HeroItem>) => {
    try {
      const itemRef = doc(db, "heroContent", id)
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date(),
      })
      await fetchHeroItems()
      setEditingId(null)
    } catch (error) {
      console.error("Error updating hero item:", error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const itemRef = doc(db, "heroContent", id)
      await deleteDoc(itemRef)
      await fetchHeroItems()
    } catch (error) {
      console.error("Error deleting hero item:", error)
    }
  }

  const handleReorder = async (index: number, direction: "up" | "down") => {
    try {
      const newItems = [...heroItems]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= heroItems.length) return

      // Swap orders
      const tempOrder = newItems[index].order
      newItems[index].order = newItems[targetIndex].order
      newItems[targetIndex].order = tempOrder

      // Update Firebase
      await Promise.all([
        updateDoc(doc(db, "heroContent", newItems[index].id), { order: newItems[index].order }),
        updateDoc(doc(db, "heroContent", newItems[targetIndex].id), { order: newItems[targetIndex].order }),
      ])

      await fetchHeroItems()
    } catch (error) {
      console.error("Error reordering items:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hero Section Dashboard</h1>

      {/* Add New Item Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Hero Item</h2>
        <div className="grid gap-4">
          <Select
            label="Type"
            value={newItem.type}
            onChange={(e: { target: { value: string } }) => setNewItem({ ...newItem, type: e.target.value as "image" | "video" })}
          >
            <SelectItem key="image" value="image">Image</SelectItem>
            <SelectItem key="video" value="video">Video</SelectItem>
          </Select>
          <div>
            <label htmlFor="new-url" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <Input
              id="new-url"
              value={newItem.url}
              onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              placeholder="Enter image or video URL"
            />
          </div>
          <div>
            <label htmlFor="new-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input
              id="new-title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Enter title"
            />
          </div>
          <div>
            <label htmlFor="new-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input
              id="new-description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <Switch
            isSelected={newItem.active}
            onValueChange={(value) => setNewItem({ ...newItem, active: value })}
          >
            Active
          </Switch>
          <Button
            color="primary"
            onClick={handleAddItem}
            isLoading={isAdding}
            disabled={!newItem.url || !newItem.title}
          >
            Add Item
          </Button>
        </div>
      </motion.div>

      {/* Existing Items List */}
      <div className="grid gap-4">
        {heroItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {item.type === "image" ? (
                <img src={item.url} alt={item.title} className="w-20 h-20 object-cover rounded" />
              ) : (
                <video src={item.url} className="w-20 h-20 object-cover rounded" muted />
              )}
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm">Type: {item.type}</p>
                <p className="text-sm">Order: {item.order}</p>
                <p className="text-sm">Active: {item.active ? "Yes" : "No"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              >
                {editingId === item.id ? "Cancel" : "Edit"}
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </Button>
              <Button
                size="sm"
                disabled={index === 0}
                onClick={() => handleReorder(index, "up")}
              >
                ↑
              </Button>
              <Button
                size="sm"
                disabled={index === heroItems.length - 1}
                onClick={() => handleReorder(index, "down")}
              >
                ↓
              </Button>
            </div>
            {editingId === item.id && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
                <div className="grid gap-4">
                  <div>
                    <label htmlFor={`edit-url-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <Input
                      id={`edit-url-${item.id}`}
                      defaultValue={item.url}
                      onChange={(e) => handleUpdateItem(item.id, { url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-title-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Input
                      id={`edit-title-${item.id}`}
                      defaultValue={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-description-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Input
                      id={`edit-description-${item.id}`}
                      defaultValue={item.description}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    />
                  </div>
                  <Switch
                    isSelected={item.active}
                    onValueChange={(value) => handleUpdateItem(item.id, { active: value })}
                  >
                    Active
                  </Switch>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}