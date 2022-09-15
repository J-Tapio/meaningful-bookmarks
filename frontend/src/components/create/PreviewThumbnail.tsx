
export default function PreviewThumbNail({text, pulsate}: {text: string, pulsate:boolean}) {
  return (
    <div className="h-[300px] bg-slate-700 rounded-xl flex justify-center items-center">
      <p className={pulsate ? "animate-pulse font-bold text-2xl text-white" : "font-bold text-2xl text-white"}>
        {text}
      </p>
    </div>
  );
}
