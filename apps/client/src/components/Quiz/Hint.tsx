export default function HintButton({ hint }: { hint: string }) {
  return (
    <div className="relative">
      <button className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200">Hover to see the translation</button>

      <div className="tooltip invisible absolute rounded bg-gray-900 p-2 text-sm text-white">{hint}</div>
    </div>
  );
}
