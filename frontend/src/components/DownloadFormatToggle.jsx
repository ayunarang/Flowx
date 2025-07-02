
export default function DownloadFormatToggle({ format, setFormat }) {
    const options = [
        { value: 'png', label: 'Image' },
        { value: 'pdf', label: 'Document' },
    ];

    return (
        <div className="flex gap-2 mb-4 items-center justify-center">
            {options.map((option) => {
                const isActive = format === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => setFormat(option.value)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border
              transition-colors duration-200 w-full
              ${isActive
                                ? 'border-canvaPurple text-canvaPurple bg-white'
                                : 'border-gray-200 text-gray-500 bg-white'
                            }
            `}
                    >
                        <span className="text-3xl font-semibold">{option.value.toUpperCase()}</span>

                        <span className="text-sm font-medium">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
