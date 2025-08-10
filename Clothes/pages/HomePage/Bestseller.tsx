"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sales?: number;
}

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      orderBy("sales", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching best sellers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 text-sm">Loading best sellers...</p>;
  }

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">🔥 Best Sellers</h2>
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:max-w-6xl md:mx-auto">
        {products.map((product) => (
          <Card
            key={product.id}
            className="relative flex-none w-[180px] sm:w-[240px] bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 snap-center border-none group "
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                Hot
              </span>
            </div>
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-semibold text-gray-800 truncate">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between p-3">
              <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded-md transition-colors duration-200">
                Add
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}