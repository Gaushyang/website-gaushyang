// Retired client-project media must not fall through to static assets or cached images.
const retiredFiles = new Set([
  '/demo/建設.png',
  '/demo/combiner.png',
  '/demo/oneweb.png',
  '/images/history-2022.jpg'
]);
const retiredDirectories = [
  '/images/oneweb-gallery',
  '/images/das-gallery',
  '/低軌衛星(oneweb)',
  '/室內分散式天線系統 (DAS)'
];

export function onRequest({ request, next }) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url).pathname);
  } catch {
    return new Response('Invalid path', { status: 400 });
  }
  const retired = retiredFiles.has(pathname) || retiredDirectories.some(
    directory => pathname === directory || pathname.startsWith(`${directory}/`)
  );
  if (!retired) return next();
  return new Response(request.method === 'HEAD' ? null : 'This resource is no longer available.', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, noarchive'
    }
  });
}
