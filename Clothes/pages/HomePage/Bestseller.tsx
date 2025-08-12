"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Loading best sellers...
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          No best sellers available.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-2 tracking-tighter text-3xl font-bold text-left text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Best Seller
        </h2>
        <p className="mb-8 text-lg text-left text-zinc-900 dark:text-zinc-100 tracking-tight">
          Our most popular picks, loved by customers.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="block w-full max-w-[160px] sm:max-w-[280px] group"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl",
                  "bg-white/80 dark:bg-zinc-900/80",
                  "backdrop-blur-xl",
                  "border border-zinc-200/50 dark:border-zinc-800/50",
           
                  "transition-all duration-300",
               
                  "hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
                )}
              >
                {/* Image */}
                <div className="relative h-[200px] sm:h-[320px] overflow-hidden">
                  <Image
                    src={product.image || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Gradient Overlay */}
                <div
                  className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  )}
                />

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium",
                      "bg-white/90 text-zinc-800",
                      "dark:bg-zinc-900/90 dark:text-zinc-200",
                      "backdrop-blur-md",
                  
                      "border border-white/20 dark:border-zinc-800/50"
                    )}
                  >
                    Hot
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white dark:text-zinc-100 leading-snug tracking-tighter">
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold text-white ">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        "bg-white/10 dark:bg-zinc-800/50",
                        "backdrop-blur-md",
                        "group-hover:bg-white/20 dark:group-hover:bg-zinc-700/50",
                        "transition-colors duration-300 group"
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:-rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
