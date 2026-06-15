export default function LoadingSpinner({ size = 'md', message }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-2 border-indigo-500 border-t-transparent rounded-full animate-spin`} />
      {message && <p className="text-slate-400 text-sm">{message}</p>}
    </div>
  );
}
