"use client";

import { NormalizedVariant } from "@/types/printful";

interface VariantSelectorProps {
  variants: NormalizedVariant[];
  selectedVariant: NormalizedVariant | null;
  onSelect: (variant: NormalizedVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.options.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.options.color).filter(Boolean))];

  const selectedSize = selectedVariant?.options.size;
  const selectedColor = selectedVariant?.options.color;

  // Only use color filter if we actually have colors to display
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  const handleSizeChange = (size: string) => {
    const variant = variants.find(
      (v) =>
        v.options.size === size &&
        (!hasColors || !selectedColor || v.options.color === selectedColor)
    );
    if (variant) onSelect(variant);
  };

  const handleColorChange = (color: string) => {
    const variant = variants.find(
      (v) =>
        v.options.color === color &&
        (!hasSizes || !selectedSize || v.options.size === selectedSize)
    );
    if (variant) onSelect(variant);
  };

  const isVariantAvailable = (size?: string, color?: string) => {
    return variants.some(
      (v) =>
        (!size || v.options.size === size) &&
        (!hasColors || !color || v.options.color === color)
    );
  };

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              const isAvailable = isVariantAvailable(size, hasColors ? selectedColor : undefined);

              return (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size!)}
                  disabled={!isAvailable}
                  className={`min-w-[48px] border-2 px-4 py-2 text-sm font-bold uppercase transition-all ${
                    isSelected
                      ? "border-lime-400 bg-lime-400 text-black"
                      : isAvailable
                        ? "border-zinc-700 text-white hover:border-lime-400"
                        : "cursor-not-allowed border-zinc-800 text-zinc-600 line-through"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              const isAvailable = isVariantAvailable(hasSizes ? selectedSize : undefined, color);

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color!)}
                  disabled={!isAvailable}
                  className={`border-2 px-4 py-2 text-sm font-bold uppercase transition-all ${
                    isSelected
                      ? "border-lime-400 bg-lime-400 text-black"
                      : isAvailable
                        ? "border-zinc-700 text-white hover:border-lime-400"
                        : "cursor-not-allowed border-zinc-800 text-zinc-600 line-through"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {variants.length === 1 && (
        <p className="text-sm text-zinc-500">One size fits all</p>
      )}
    </div>
  );
}
