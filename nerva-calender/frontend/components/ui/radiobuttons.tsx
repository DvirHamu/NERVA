interface Option {
  label: string;
  value: string;
}

export function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col ml-2">
      {options.map((opt) => (
        <label key={opt.value} className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition hover:scale-102`} onClick={() => onChange(opt.value)}>
            {/* Radio Button Cirlce */}
            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center hover:scale-110 transition ${selected === opt.value ? "bg-background" : "bg-background"}`}>
                {selected === opt.value && (
                <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                )}
            </div>
          <span className="text-sm font-medium text-foreground">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
