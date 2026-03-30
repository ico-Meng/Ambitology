'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { userManager } from '@/types';

// Paths that do not require authentication
const PUBLIC_PATHS = [
  '/',
  '/mission',
  '/jobs',
  '/careers',
  '/learn',
  '/disclaimer',
  '/terms-of-service',
  '/privacy-policy',
  '/refund-policy',
  '/contact',
  '/alpha',
  // Dashboard handles its own OIDC callback — exclude it
  '/dashboard',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

export default function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isPublicPath(pathname)) return;

    userManager.getUser().then((user) => {
      if (!user || user.expired) {
        router.replace('/');
      }
    });
  }, [pathname, router]);

  return null;
}
