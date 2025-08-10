import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

// Define the props for each card
export interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  badge?: {
    text: string;
    variant: "pink" | "indigo" | "orange";
  };
  href?: string;
}

// Define the props for the grid
interface CardGridProps {
  gridTitle?: string;
}

export default function Category({ gridTitle = "Category" }: CardGridProps) {
  const [items, setItems] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user || true) { // Modify based on your security rules; `true` assumes public read access
        console.log("User:", user ? user.uid : "Unauthenticated");
        await fetchCollections();
      } else {
        console.log("No user is signed in.");
        setLoading(false);
      }
    });

    const fetchCollections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const collectionsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.name || "Unnamed Category",
            subtitle: "",
            image: data.image,
            badge: { text: "New", variant: "orange" },
            href: "#",
          };
        }) as CardProps[];
        setItems(collectionsData);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">No items to display.</p>
      </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {gridTitle && (
          <h2 className="mb-2 tracking-tighter text-3xl font-bold text-left text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {gridTitle}
          </h2>
        )}
        <p className="mb-8 text-lg text-left text-zinc-900 dark:text-zinc-100 tracking-tight">
          Explore the category
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
          {items.map((item, index) => (
            <Link
              key={`${item.href}-${item.title}-${index}`}
              href={item.href || "#"}
              target="_blank"
              className="block w-full max-w-[160px] sm:max-w-[280px] group"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl",
                  "bg-white/80 dark:bg-zinc-900/80",
                  "backdrop-blur-xl",
                  "border border-zinc-200/50 dark:border-zinc-800/50",
                  "shadow-xs",
                  "transition-all duration-300",
                  "hover:shadow-md",
                  "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
                )}
              >
                <div className="relative h-[200px] sm:h-[320px] overflow-hidden">
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.title || "Collection Item"}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className={cn("absolute inset-0", "bg-gradient-to-t from-black/90 via-black/40 to-transparent")} />
                <div className="absolute top-3 right-3">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium",
                      "bg-white/90 text-zinc-800",
                      "dark:bg-zinc-900/90 dark:text-zinc-200",
                      "backdrop-blur-md",
                      "shadow-xs",
                      "border border-white/20 dark:border-zinc-800/50",
                    )}
                  >
                    {item.badge?.text || "New"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white dark:text-zinc-100 leading-snug tracking-tighter">
                        {item.title || "Modern Design Systems"}
                      </h3>
                      <p className="text-sm text-zinc-200 dark:text-zinc-300 line-clamp-2 tracking-tight">
                        {item.subtitle || "Explore the fundamentals of contemporary UI design"}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        "bg-white/10 dark:bg-zinc-800/50",
                        "backdrop-blur-md",
                        "group-hover:bg-white/20 dark:group-hover:bg-zinc-700/50",
                        "transition-colors duration-300 group",
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:-rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}