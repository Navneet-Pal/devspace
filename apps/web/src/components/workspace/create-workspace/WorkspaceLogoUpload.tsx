"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface WorkspaceLogoUploadProps {
  value?: File;
  onChange: (file?: File) => void;
}

export const WorkspaceLogoUpload = ({
  value,
  onChange,
}: WorkspaceLogoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onChange(file);
  };

  const handleRemove = () => {
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Workspace Logo</label>

      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
          {preview ? (
            <img
              src={preview}
              alt="Workspace logo preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleSelect}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            Upload Logo
          </Button>

          {value && (
            <Button type="button" variant="destructive" onClick={handleRemove}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        PNG, JPG or WEBP up to 5 MB.
      </p>
    </div>
  );
};
