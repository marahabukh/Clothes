"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ProductProps {
  id?: string;
  productId?: string;
  name: string;
  image: string;
  price: number;
  sales: number;
}

export default function ProductsDashboard() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", image: "", price: 0, sales: 0 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ProductProps[];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const productRef = doc(db, "products", editingId);
        await updateDoc(productRef, newProduct);
        setProducts(products.map((p) => (p.id === editingId ? { ...p, ...newProduct } : p)));
      } else {
        const docRef = await addDoc(collection(db, "products"), {
          ...newProduct,
          productId: "",
        });
        await updateDoc(doc(db, "products", docRef.id), { productId: docRef.id });

        setProducts([...products, { id: docRef.id, productId: docRef.id, ...newProduct }]);
      }
      setNewProduct({ name: "", image: "", price: 0, sales: 0 });
      setEditingId(null);
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  const handleEdit = (product: ProductProps) => {
    setNewProduct({
      name: product.name,
      image: product.image,
      price: product.price,
      sales: product.sales || 0,
    });
    setEditingId(product.id || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // زيادة مبيعات المنتج ب 1 - تعيينه كـ Best Seller
  const markAsBestSeller = async (product: ProductProps) => {
    if (!product.id) return;
    try {
      const productRef = doc(db, "products", product.id);
      const newSales = (product.sales || 0) + 1;
      await updateDoc(productRef, { sales: newSales });
      setProducts(products.map((p) =>
        p.id === product.id ? { ...p, sales: newSales } : p
      ));
    } catch (error) {
      console.error("Error marking product as best seller:", error);
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
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Manage Products</h1>

      <form onSubmit={handleAddOrUpdateProduct} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        {/* form fields ... */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Product Name</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Image URL</label>
          <input
            type="text"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter image URL"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Price</label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="mt-1 p-2 w-full border rounded-md"
            min={0}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Sales</label>
          <input
            type="number"
            value={newProduct.sales}
            onChange={(e) => setNewProduct({ ...newProduct, sales: parseInt(e.target.value) || 0 })}
            className="mt-1 p-2 w-full border rounded-md"
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setNewProduct({ name: "", image: "", price: 0, sales: 0 });
              setEditingId(null);
            }}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-white rounded-lg shadow-md relative">
            <div className="relative w-full h-48 overflow-hidden rounded-md">
              <Image
                src={product.image || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">{product.name}</h3>
            <p className="text-sm text-zinc-600">${product.price}</p>
            <p className="text-xs text-zinc-400">Sales: {product.sales}</p>
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => handleEdit(product)}
                className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id!)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => markAsBestSeller(product)}
                className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Mark as Best Seller
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
