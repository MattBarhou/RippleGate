import { useRef } from "react";
import { MdCloudUpload } from "react-icons/md";

export default function ImageUploader({
  imagePreview,
  onImageChange,
  height = "h-48",
  label = "Upload Image",
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && typeof onImageChange === "function") {
      onImageChange(file);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current.click()}
      className={`w-full ${height} rounded-xl border-2 border-dashed border-purple-400/50 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400/70 transition-colors group overflow-hidden relative bg-black/20`}
    >
      {imagePreview ? (
        <div className="w-full h-full relative">
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
            <span className="text-white text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              Click to change image
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-300 group-hover:text-cyan-400">
          <MdCloudUpload className="text-4xl mb-2" />
          <span className="font-medium mb-1">{label}</span>
          <p className="text-xs text-gray-500">Click or drag image here</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
