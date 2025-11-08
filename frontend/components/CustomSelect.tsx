"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowDown01Icon, CheckmarkCircle02Icon } from "@hugeicons/react";

export interface SelectOption {
  value: string;
  isTested?: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[] | SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  isDark?: boolean; // Dark mode support
  isCompact?: boolean; // Compact size for chat input
  onSelectUnconfigured?: (option: string) => void; // Callback for unconfigured model selection
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  label,
  disabled = false,
  className = "",
  isDark = false,
  isCompact = false,
  onSelectUnconfigured,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Normalize options to SelectOption format
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, isTested: false } : opt
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle option selection
  const handleSelectOption = (option: SelectOption) => {
    if (!option.isTested && onSelectUnconfigured) {
      // If unconfigured, trigger callback instead of changing value
      onSelectUnconfigured(option.value);
      setIsOpen(false);
    } else {
      // Normal selection
      onChange(option.value);
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelectOption(normalizedOptions[highlightedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < normalizedOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    handleSelectOption(option);
    setHighlightedIndex(-1);
  };

  const displayValue = value || placeholder;
  const hasValue = !!value;

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-[10000]' : 'z-auto'} ${className}`}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          {label}
        </label>
      )}
      
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full ${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2.5 text-sm'} border ${isCompact ? 'rounded-md' : 'rounded-xl'} text-left flex items-center justify-between transition-all font-medium ${
          isDark
            ? disabled
              ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
              : isOpen
              ? "bg-zinc-900 border-zinc-600 text-zinc-100"
              : "bg-zinc-900 border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:border-zinc-600"
            : disabled
              ? "border-zinc-200 text-zinc-400 cursor-not-allowed bg-zinc-50"
              : isOpen
              ? "bg-white border-blue-400 text-zinc-900"
              : "bg-white border-zinc-300 text-zinc-900 hover:border-zinc-400"
        }`}
      >
        <span className={hasValue ? (isDark ? "text-zinc-100 font-medium" : "text-zinc-900 font-medium") : (isDark ? "text-zinc-500" : "text-zinc-500")}>
          {displayValue}
        </span>
        <ArrowDown01Icon
          size={isCompact ? 14 : 16}
          strokeWidth={2}
          className={`transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          } ${disabled ? (isDark ? "text-zinc-600" : "text-zinc-400") : (isDark ? "text-zinc-400" : "text-zinc-500")}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`absolute z-[9999] w-full mt-1 border rounded-lg shadow-xl overflow-hidden ${
            isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {normalizedOptions.length === 0 ? (
              <div className={`px-4 py-3 text-sm text-center ${isDark ? 'text-gray-500' : 'text-zinc-500'}`}>
                No options available
              </div>
            ) : (
              normalizedOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full ${isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'} text-left flex items-center gap-2 transition-colors ${
                      isDark
                        ? isSelected
                          ? "bg-zinc-800 text-white font-medium"
                          : isHighlighted
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-300 hover:bg-zinc-800"
                        : isSelected
                          ? "bg-zinc-100 text-zinc-900 font-medium"
                          : isHighlighted
                          ? "bg-zinc-50 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {/* Green dot indicator for tested models */}
                    {option.isTested && (
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Configured and tested" />
                    )}
                    <span className="truncate flex-1">{option.value}</span>
                    {isSelected && (
                      <CheckmarkCircle02Icon
                        size={isCompact ? 14 : 16}
                        strokeWidth={2}
                        className={`flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

