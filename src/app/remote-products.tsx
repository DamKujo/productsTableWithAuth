import { useEffect, useRef, useState } from "react";
import type { ProductsInstance } from "products/ProductsPage";
import { sessionApi } from "@/shared/auth/public-api";
import { ROUTES } from "@/shared/model/config";
import { GeneralLayout } from "@/shared/layout/general-layout";

// Route component for /products/*: the shell owns the layout and the session,
// the products remote renders the table inside the container
export default function RemoteProducts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ProductsInstance | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("products/ProductsPage")
      .then(({ mount }) => {
        if (cancelled || !containerRef.current) return;
        instanceRef.current = mount(containerRef.current, {
          session: sessionApi,
          basePath: ROUTES.PRODUCTS,
        });
      })
      .catch((error) => {
        console.error("Failed to load products remote", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      instanceRef.current?.unmount();
      instanceRef.current = null;
    };
  }, []);

  return (
    <GeneralLayout>
      {failed && (
        <p className="p-8 text-center text-gray-500">
          Каталог товаров временно недоступен. Попробуйте обновить страницу.
        </p>
      )}
      <div ref={containerRef} />
    </GeneralLayout>
  );
}
