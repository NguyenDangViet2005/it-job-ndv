import { ImageIcon, Video, Smile, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_AVATARS } from "@/constants/app-config";

interface CreatePostFormProps {
  newPost: string;
  setNewPost: (value: string) => void;
  selectedImages: File[];
  selectedVideo: File | null;
  isCreatingPost: boolean;
  isAuthenticated: boolean;
  currentUserAvatar?: string;
  currentUserName?: string;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveVideo: () => void;
  onSubmit: () => void;
}

export default function CreatePostForm({
  newPost,
  setNewPost,
  selectedImages,
  selectedVideo,
  isCreatingPost,
  isAuthenticated,
  currentUserAvatar,
  currentUserName = "Bạn",
  imageInputRef,
  videoInputRef,
  onImageSelect,
  onVideoSelect,
  onRemoveImage,
  onRemoveVideo,
  onSubmit,
}: CreatePostFormProps) {
  return (
    <>
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={onImageSelect}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={onVideoSelect}
      />

      <Card className="mt-2 sm:mt-0 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        <CardContent className="p-3 lg:p-6">
          <div className="flex gap-2 lg:gap-3">
            <Avatar className="cursor-target hover:scale-110 transition-transform duration-300 h-8 w-8 lg:h-10 lg:w-10">
              <AvatarImage src={currentUserAvatar || DEFAULT_AVATARS.USER} />
              <AvatarFallback className="text-xs lg:text-sm">{currentUserName.charAt(0)}</AvatarFallback>
            </Avatar>
            <textarea
              placeholder={
                isAuthenticated
                  ? "Chia sẻ kiến thức hoặc kinh nghiệm của bạn..."
                  : "Vui lòng đăng nhập để đăng bài..."
              }
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={!isAuthenticated}
              className="cursor-target flex min-h-[60px] lg:min-h-[80px] w-full rounded-md border border-input bg-background px-2 lg:px-3 py-2 text-xs lg:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/50 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Selected images preview */}
          {selectedImages.length > 0 && (
            <div className="flex gap-2 mt-3 lg:mt-4 flex-wrap">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Selected ${index + 1}`}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 h-4 w-4 lg:h-5 lg:w-5 rounded-full"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-2 w-2 lg:h-3 lg:w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Selected video preview */}
          {selectedVideo && (
            <div className="relative mt-3 lg:mt-4 inline-block">
              <video
                src={URL.createObjectURL(selectedVideo)}
                className="w-32 h-20 lg:w-40 lg:h-24 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 h-4 w-4 lg:h-5 lg:w-5 rounded-full"
                onClick={onRemoveVideo}
              >
                <X className="h-2 w-2 lg:h-3 lg:w-3" />
              </Button>
            </div>
          )}

          <Separator className="my-3 lg:my-4" />
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex gap-1 lg:gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="cursor-target hover:bg-green-50 dark:hover:bg-green-950 hover:scale-105 transition-all duration-300 h-8 lg:h-9 px-2 lg:px-3 text-xs lg:text-sm"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" />
                <span className="hidden sm:inline">Ảnh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="cursor-target hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 transition-all duration-300 h-8 lg:h-9 px-2 lg:px-3 text-xs lg:text-sm"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-red-600" />
                <span className="hidden sm:inline">Video</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="cursor-target hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:scale-105 transition-all duration-300 h-8 lg:h-9 px-2 lg:px-3 text-xs lg:text-sm hidden sm:flex"
              >
                <Smile className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-yellow-600" />
                Cảm xúc
              </Button>
            </div>
            <Button
              size="sm"
              onClick={onSubmit}
              disabled={isCreatingPost || !newPost.trim() || !isAuthenticated}
              className="cursor-target hover:scale-105 transition-transform duration-300 disabled:bg-gray-400 h-8 lg:h-9 px-3 lg:px-4 text-xs lg:text-sm"
            >
              {isCreatingPost ? (
                <Loader2 className="h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
              ) : (
                "Đăng"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
