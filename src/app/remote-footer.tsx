import { useEffect, useRef } from "react";
import type { FooterProps, FooterInstance } from "footer/Footer";

// Bridges the Vue 2 header remote into React: React owns the container div,
// the remote's mount() renders inside it
export function RemoteFooter(props: FooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<FooterInstance | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    let cancelled = false;

    import("footer/Footer")
      .then(({ mount }) => {
        if (cancelled || !containerRef.current) return;
        instanceRef.current = mount(containerRef.current, propsRef.current);
      })
      .catch((error) => {
        // the host keeps working without the header if the remote is down
        console.error("Failed to load header remote", error);
      });

    return () => {
      cancelled = true;
      instanceRef.current?.unmount();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.update(props);
  }, [props.title, props.year]);

  return <div ref={containerRef} />;
}
