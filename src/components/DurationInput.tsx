import React, { useState, useEffect, useRef } from 'react';

interface DurationInputProps {
    value: number; // total seconds
    onChange: (seconds: number) => void;
    label?: string;
}

const DurationInput: React.FC<DurationInputProps> = ({ value, onChange, label }) => {
    const hhRef = useRef<HTMLInputElement>(null);
    const mmRef = useRef<HTMLInputElement>(null);
    const ssRef = useRef<HTMLInputElement>(null);

    const [hh, setHh] = useState('00');
    const [mm, setMm] = useState('00');
    const [ss, setSs] = useState('00');

    // Load from seconds
    useEffect(() => {
        const h = Math.floor(value / 3600);
        const m = Math.floor((value % 3600) / 60);
        const s = value % 60;
        setHh(h.toString().padStart(2, '0'));
        setMm(m.toString().padStart(2, '0'));
        setSs(s.toString().padStart(2, '0'));
    }, [value]);

    const updateTotalSeconds = (newHh: string, newMm: string, newSs: string) => {
        const h = parseInt(newHh) || 0;
        const m = parseInt(newMm) || 0;
        const s = parseInt(newSs) || 0;
        onChange(h * 3600 + m * 60 + s);
    };

    const handleHhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(-2);
        setHh(val);
        if (val.length === 2) {
            mmRef.current?.focus();
            updateTotalSeconds(val, mm, ss);
        }
    };

    const handleMmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(-2);
        if (val.length === 2) {
            const num = parseInt(val);
            const finalVal = num > 59 ? '59' : val;
            setMm(finalVal);
            ssRef.current?.focus();
            updateTotalSeconds(hh, finalVal, ss);
        } else {
            setMm(val);
        }
    };

    const handleSsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(-2);
        if (val.length === 2) {
            const num = parseInt(val);
            const finalVal = num > 59 ? '59' : val;
            setSs(finalVal);
            updateTotalSeconds(hh, mm, finalVal);
        } else {
            setSs(val);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').padStart(2, '0');
        const placeholder = e.target.placeholder;

        let newHh = hh;
        let newMm = mm;
        let newSs = ss;

        if (placeholder === 'HH') {
            newHh = val;
            setHh(val);
        } else if (placeholder === 'MM') {
            newMm = val;
            setMm(val);
        } else if (placeholder === 'SS') {
            newSs = val;
            setSs(val);
        }

        updateTotalSeconds(newHh, newMm, newSs);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <div className="flex flex-col mb-6 animate-fade-in group">
            {label && (
                <label className="text-sm font-bold text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
                {/* HH */}
                <input
                    ref={hhRef}
                    type="text"
                    value={hh}
                    onChange={handleHhChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={{ backgroundColor: '#ffffff' }}
                    className="w-14 h-12 text-gray-900 text-center text-xl font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400"
                    placeholder="HH"
                />
                <span className="text-gray-400 font-bold">:</span>

                {/* MM */}
                <input
                    ref={mmRef}
                    type="text"
                    value={mm}
                    onChange={handleMmChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={{ backgroundColor: '#ffffff' }}
                    className="w-14 h-12 text-gray-900 text-center text-xl font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400"
                    placeholder="MM"
                />
                <span className="text-gray-400 font-bold">:</span>

                {/* SS */}
                <input
                    ref={ssRef}
                    type="text"
                    value={ss}
                    onChange={handleSsChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={{ backgroundColor: '#ffffff' }}
                    className="w-14 h-12 text-gray-900 text-center text-xl font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400"
                    placeholder="SS"
                />
            </div>
        </div>
    );
};

export default DurationInput;
