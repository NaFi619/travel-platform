import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextArea?: boolean;
}

export default function FormInput({ label, isTextArea = false, ...props }: InputProps) {
  const baseStyles = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all";

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-500 uppercase ml-1 tracking-wider">
        {label}
      </label>
      
      {isTextArea ? (
        <textarea 
          className={`${baseStyles} resize-none`} 
          rows={5}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
        />
      ) : (
        <input 
          className={baseStyles} 
          {...props} 
        />
      )}
    </div>
  );
}