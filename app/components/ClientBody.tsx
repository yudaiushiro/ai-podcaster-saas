'use client';

import { useEffect, useState } from 'react';

interface ClientBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientBody({ children, className }: ClientBodyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // クライアントサイドでのレンダリングが完了したことをマーク
    setMounted(true);
  }, []);

  // data-suppress-hydration-warningを追加してハイドレーション警告を抑制
  return (
    <body 
      className={className} 
      data-suppress-hydration-warning={true}
    >
      {children}
    </body>
  );
} 