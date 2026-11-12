"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onIdle } from "@/lib/idle";
import { toasterLoadEvent, toasterMounted } from "@/lib/toast";

const Toaster = dynamic(
  () =>
    import("@/components/ui/sonner").then(({ Toaster }) => {
      function MountedToaster(props: React.ComponentProps<typeof Toaster>) {
        useEffect(() => {
          // Let sonner subscribe to its store before the first toast is sent.
          requestAnimationFrame(() => toasterMounted());
        }, []);
        return <Toaster {...props} />;
      }
      return MountedToaster;
    }),
  { ssr: false },
);

/** Mounts the toast container once the page is idle, or straight away when a toast is needed. */
export function ToasterLoader() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const start = () => setLoad(true);
    window.addEventListener(toasterLoadEvent, start, { once: true });
    const cancel = onIdle(start);
    return () => {
      window.removeEventListener(toasterLoadEvent, start);
      cancel();
    };
  }, []);

  return load ? <Toaster position="bottom-center" mobileOffset={{ bottom: 88 }} /> : null;
}
