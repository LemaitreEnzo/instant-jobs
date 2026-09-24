import React, { useRef, useState } from "react";
import type { PropsFileInput } from "../../../types/props.type";

import "./FileInput.css";
import Button from "../Button/Button";

const FileInput = ({
  name,
  id,
  accept = "image/jpeg,image/png,image/svg+xml,image/webp",
  title = "Choisir un fichier ou le déposer ici",
  helperText = "JPEG, PNG, SVG and WebP format uniquement, 50Mo maximum",
  buttonText = "Parcourir",
  maxSizeMB = 50,
  customClassName,
  error,
  onFileSelect,
  onError,
  ...props
}: PropsFileInput) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFileTypeValid = (file: File, acceptString: string) => {
    if (!acceptString) return true;

    const acceptedTypes = acceptString.split(",").map((t) => t.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    return acceptedTypes.some((type) => {
        return fileType === type;
    });
  }

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) {
      return;
    }

    if (accept && !isFileTypeValid(selectedFile, accept)) {
      onError?.("Format de fichier non autorisé. Formats acceptés : JPEG, PNG, SVG, WebP.");
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      onError?.(`Le fichier est trop volumineux. La taille maximale est de ${maxSizeMB} Mo.`);
      return;
    }

    onError?.(null);
    setFile(selectedFile);
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  const finalClassName = [`file-input ${isDragOver ? "drag-over" : ""} ${error ? "error" : ""}`, customClassName].join(" ").trim();

  return (
    <div
      className={finalClassName}
      {...props}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        onChange={handleInputChange}
        className="file-input-hidden"
      />

      <div className="file-input-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.35 10.04C19.0141 8.33772 18.0976 6.80486 16.7571 5.70325C15.4165 4.60163 13.7351 3.99961 12 4C9.11 4 6.6 5.64 5.35 8.04C3.88023 8.19883 2.52101 8.89521 1.53349 9.99532C0.545971 11.0954 -0.000171702 12.5217 4.04928e-08 14C4.04928e-08 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L11.65 8.35C11.85 8.15 12.16 8.15 12.36 8.35L17 13H14Z" fill="currentColor" />
        </svg>
      </div>

      <span className="file-input-title">{title}</span>
      <span className="file-input-helper">{helperText}</span>

      <Button
        type="button"
        shape="rectangle"
        className="btn-primary"
        onClick={() => inputRef.current?.click()}
      >
        <span>{buttonText}</span>
      </Button>

      {file && <span className="file-input-filename">{file.name}</span>}
    </div>
  );
}
export default FileInput