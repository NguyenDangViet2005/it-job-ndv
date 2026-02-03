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

      <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        <CardContent className="">
          <div className="flex gap-3">
            <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
              <AvatarImage src={currentUserAvatar || DEFAULT_AVATARS.USER} />
              <AvatarFallback>{currentUserName.charAt(0)}</AvatarFallback>
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
              className="cursor-target flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/50 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Selected images preview */}
          {selectedImages.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Selected ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Selected video preview */}
          {selectedVideo && (
            <div className="relative mt-4 inline-block">
              <video
                src={URL.createObjectURL(selectedVideo)}
                className="w-40 h-24 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                onClick={onRemoveVideo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="cursor-target hover:bg-green-50 dark:hover:bg-green-950 hover:scale-105 transition-all duration-300"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
                Ảnh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="cursor-target hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 transition-all duration-300"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="h-4 w-4 mr-2 text-red-600" />
                Video
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="cursor-target hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:scale-105 transition-all duration-300"
              >
                <Smile className="h-4 w-4 mr-2 text-yellow-600" />
                Cảm xúc
              </Button>
            </div>
            <Button
              size="sm"
              onClick={onSubmit}
              disabled={isCreatingPost || !newPost.trim() || !isAuthenticated}
              className="cursor-target hover:scale-105 transition-transform duration-300 disabled:bg-gray-400"
            >
              {isCreatingPost ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Đăng bài"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
