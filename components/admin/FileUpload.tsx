"use client";

import React, { useCallback } from "react";
import { FileText, ImageIcon, Upload } from "lucide-react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  variant: "image" | "pdf";
  type: "dropzone" | "button";
  onFiles: (files: File[]) => void | Promise<void>;
  className?: string;
}

const FileUpload = ({ onFiles, variant, type, className }: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      void onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const tooManyFiles = fileRejections.find(
          (fr) => fr.errors[0]?.code === "too-many-files"
        );
        const fileTooLarge = fileRejections.find(
          (fr) => fr.errors[0]?.code === "file-too-large"
        );
        const wrongFileType = fileRejections.find(
          (fr) => fr.errors[0]?.code === "wrong-file-type"
        );

        if (tooManyFiles) {
          toast.error(
            variant === "image" ? "Maks antall filer er 10" : "Maks antall filer er 1"
          );
        }
        if (fileTooLarge) {
          toast.error("Filene er for store");
        }
        if (wrongFileType) {
          toast.error(
            variant === "image"
              ? "Du kan bare laste opp bilder"
              : "Du kan bare laste opp pdf"
          );
        }
      }
    },
    [variant]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: variant === "image" ? 10 : 1,
    maxSize: 1024 * 1024 * 10,
    accept:
      variant === "image"
        ? { "image/*": [] }
        : { "application/pdf": [".pdf"] },
  });

  const VariantIcon = variant === "image" ? ImageIcon : FileText;

  if (type === "button") {
    return (
      <div {...getRootProps()} className={cn("cursor-pointer", className)}>
        <input {...getInputProps()} />
        <Button
          size="xsm"
          variant="secondary"
          className="h-8 w-full min-w-0 sm:min-w-auto sm:w-auto"
        >
          <Upload size={14} />
          Last opp ny pdf
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
        "bg-gradient-to-br from-muted/60 via-muted/30 to-background",
        "hover:border-primary/40 hover:from-primary/5 hover:shadow-lg",
        isDragActive && [
          "scale-[1.02] border-primary bg-primary/10 shadow-xl ring-2 ring-primary/20",
        ],
        variant === "image" && "hover:border-blue-500/40 hover:from-blue-500/5",
        variant === "pdf" && "hover:border-amber-500/40 hover:from-amber-500/5",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_70%)] opacity-40",
          isDragActive && "opacity-60",
        )}
      />
      <input {...getInputProps()} />
      <div className="relative flex flex-col items-center gap-4 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl ring-4 transition-all duration-300",
            "bg-primary/10 ring-primary/5",
            isDragActive && "scale-110 bg-primary/20 ring-primary/20",
            variant === "image" && "bg-blue-500/10 ring-blue-500/5",
            variant === "image" && isDragActive && "bg-blue-500/20 ring-blue-500/20",
            variant === "pdf" && "bg-amber-500/10 ring-amber-500/5",
            variant === "pdf" && isDragActive && "bg-amber-500/20 ring-amber-500/20",
          )}
        >
          <VariantIcon
            className={cn(
              "size-8 text-primary/70 transition-colors",
              variant === "image" && "text-blue-600/80",
              variant === "pdf" && "text-amber-600/80",
            )}
            strokeWidth={1.5}
          />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold tracking-tight">
            {variant === "image"
              ? "Last opp bilder"
              : "Last opp prisliste (PDF)"}
          </p>
          <p
            className={cn(
              "text-sm transition-colors",
              isDragActive ? "text-primary font-medium" : "text-muted-foreground",
            )}
          >
            {isDragActive ? (
              <>Slipp filene her</>
            ) : (
              <>Klikk eller dra og slipp</>
            )}
          </p>
          {variant === "image" && (
            <p className="text-xs text-muted-foreground">
              Opptil 10 filer, maks 10 MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
