/* eslint-disable no-unused-vars */
// ============================================
// FILE: src/pages/admin/UploadVideo.jsx - UPDATED
// ============================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Upload,
  X,
  Plus,
  CheckCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Star,
  Flame,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";

// Validation schema
const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  longDescription: z
    .string()
    .min(50, "Long description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  level: z.string().min(1, "Please select a level"),
  price: z.string().min(1, "Price is required"),
  duration: z.string().min(1, "Duration is required"),
});

const UploadVideo = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [requirements, setRequirements] = useState([""]);
  const [learningPoints, setLearningPoints] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NEW - Promotional States
  const [discountPrice, setDiscountPrice] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isMostPopular, setIsMostPopular] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isHotDeal, setIsHotDeal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: zodResolver(courseSchema),
  });

  const categories = [
    "Artificial Intelligence",
    "Career Development",
    "Digital Marketing",
    "Product Design",
    "Cybersecurity",
    "Business",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "UI/UX Design",
    "Blockchain",
    "Cloud Computing",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  // Watch price for discount validation
  const priceValue = watch("price");

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  // ✅ Extract video duration
 // ✅ This function should exist (around line 107)
const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      resolve(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString().padStart(2, "0")}`
      );
    };

    video.onerror = () => {
      resolve("00:00");
    };

    video.src = URL.createObjectURL(file);
  });
};

// ✅ And this function should use it (around line 205)
// const handleLessonVideoUpload = async (moduleId, lessonId, file) => {
//   if (file) {
//     try {
//       // ✅ Get video duration
//       const duration = await getVideoDuration(file);
//       const base64 = await fileToBase64(file);

//       setModules(
//         modules.map((m) =>
//           m.id === moduleId
//             ? {
//                 ...m,
//                 lessons: m.lessons.map((l) =>
//                   l.id === lessonId
//                     ? {
//                         ...l,
//                         videoUrl: base64,
//                         videoName: file.name,
//                         duration: duration, // ✅ Add duration
//                       }
//                     : l
//                 ),
//               }
//             : m
//         )
//       );
//     } catch (error) {
//       console.error("Video upload error:", error);
//       toast.error("Failed to process video");
//     }
//   }
// };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Thumbnail must be less than 2MB");
        return;
      }

      const base64 = await fileToBase64(file);
      setThumbnail({ file, preview: base64, base64 }); // ✅ Store file object
    }
  };

  // Handle preview video upload
  const handlePreviewVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Preview video must be less than 50MB");
        return;
      }

      const base64 = await fileToBase64(file);
      setPreviewVideo({ file, name: file.name, base64 }); // ✅ Store file object
    }
  };

  // Handle certificate upload
  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Certificate must be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Certificate must be PNG, JPG, or PDF");
        return;
      }

      const base64 = await fileToBase64(file);
      setCertificate({ file, name: file.name, base64 }); // ✅ Store file object
    }
  };

  // Module Management
  const addModule = () => {
    setModules([
      ...modules,
      {
        id: Date.now(),
        title: "",
        description: "",
        order: modules.length + 1,
        lessons: [
          { id: Date.now(), title: "", videoUrl: "", duration: "", order: 1 },
        ],
      },
    ]);
  };

  const removeModule = (moduleId) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const updateModuleTitle = (moduleId, title) => {
    setModules(modules.map((m) => (m.id === moduleId ? { ...m, title } : m)));
  };

  const addLesson = (moduleId) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: Date.now(),
                  title: "",
                  videoUrl: "",
                  duration: "",
                  order: m.lessons.length + 1,
                },
              ],
            }
          : m
      )
    );
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  const updateLessonTitle = (moduleId, lessonId, title) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, title } : l
              ),
            }
          : m
      )
    );
  };

  const handleLessonVideoUpload = async (moduleId, lessonId, file) => {
    if (file) {
      try {
        // ✅ Get video duration
        const duration = await getVideoDuration(file);
        const base64 = await fileToBase64(file);

        setModules(
          modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === lessonId
                      ? {
                          ...l,
                          videoUrl: base64,
                          videoName: file.name,
                          duration: duration, // ✅ Add duration
                        }
                      : l
                  ),
                }
              : m
          )
        );
      } catch (error) {
        console.error("Video upload error:", error);
        toast.error("Failed to process video");
      }
    }
  };

  // Requirements & Learning Points
  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index, value) => {
    setRequirements(requirements.map((r, i) => (i === index ? value : r)));
  };

  const addLearningPoint = () => {
    setLearningPoints([...learningPoints, ""]);
  };

  const removeLearningPoint = (index) => {
    setLearningPoints(learningPoints.filter((_, i) => i !== index));
  };

  const updateLearningPoint = (index, value) => {
    setLearningPoints(learningPoints.map((p, i) => (i === index ? value : p)));
  };

  // Submit Course
  const onSubmit = async (data) => {
    // Validate thumbnail
    if (!thumbnail) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    setIsSubmitting(true);

    try {
      const courseData = {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        level: data.level,
        price: parseFloat(data.price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : 0,
        isFeatured,
        isMostPopular,
        isNew,
        isHotDeal,
        duration: data.duration,
        language: data.language || "English",
        thumbnail: thumbnail.base64,
        previewVideo: previewVideo?.base64 || "",
        certificateTemplate: certificate?.base64 || "",
        whatYouWillLearn: learningPoints.filter((p) => p.trim() !== ""),
        requirements: requirements.filter((r) => r.trim() !== ""),
        modules: modules.map((m) => ({
          title: m.title,
          description: m.description || "",
          order: m.order,
          lessons: m.lessons.map((l) => ({
            title: l.title,
            videoUrl: l.videoUrl || "",
            duration: l.duration || "00:00",
            order: l.order,
          })),
        })),
      };

      const response = await api.post("/api/admin/courses", courseData);

      if (response.data.success) {
        toast.success("Course created successfully! 🎉");
        setTimeout(() => {
          navigate("/admin/courses");
        }, 1500);
      }
    } catch (error) {
      console.error("Create course error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create course. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Upload New Course
          </h1>
          <p className="text-muted-foreground">
            Create and publish a new course for students
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="animate-fade-in-up animation-delay-100">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Course Title */}
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., AI Appreciation for Beginners"
                  className={errors.title ? "border-danger-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-danger-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  placeholder="Brief description for course cards..."
                  className={errors.description ? "border-danger-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-danger-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Long Description */}
              <div>
                <Label htmlFor="longDescription">Long Description *</Label>
                <Textarea
                  id="longDescription"
                  {...register("longDescription")}
                  rows={6}
                  placeholder="Detailed description of what students will learn..."
                  className={errors.longDescription ? "border-danger-500" : ""}
                />
                {errors.longDescription && (
                  <p className="text-sm text-danger-600 mt-1">
                    {errors.longDescription.message}
                  </p>
                )}
              </div>

              {/* Category, Level, Language */}
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={errors.category ? "border-danger-500" : ""}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={errors.level ? "border-danger-500" : ""}
                        >
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.level.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    {...register("language")}
                    placeholder="English"
                    defaultValue="English"
                  />
                </div>
              </div>

              {/* Price, Discount, Duration */}
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <Label htmlFor="price">Regular Price (₦) *</Label>
                  <Input
                    id="price"
                    {...register("price")}
                    type="number"
                    placeholder="25000"
                    className={errors.price ? "border-danger-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="discountPrice">Discount Price (₦)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    placeholder="20000"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                  {discountPrice &&
                    priceValue &&
                    parseFloat(discountPrice) >= parseFloat(priceValue) && (
                      <p className="text-sm text-danger-600 mt-1">
                        Discount price must be less than regular price
                      </p>
                    )}
                </div>

                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    {...register("duration")}
                    placeholder="e.g., 6 weeks"
                    className={errors.duration ? "border-danger-500" : ""}
                  />
                  {errors.duration && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ NEW - Promotional Tags */}
          <Card className="animate-fade-in-up animation-delay-150">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Promotional Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Featured */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="featured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Star className="h-4 w-4 text-primary-600" />
                      Featured Course
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Display in homepage featured section
                    </p>
                  </div>
                </div>

                {/* Most Popular */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="mostPopular"
                    checked={isMostPopular}
                    onCheckedChange={setIsMostPopular}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="mostPopular"
                      className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4 text-accent-600" />
                      Most Popular
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show "Most Popular" badge
                    </p>
                  </div>
                </div>

                {/* New Course */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="new"
                    checked={isNew}
                    onCheckedChange={setIsNew}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="new"
                      className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4 text-secondary-600" />
                      New Course
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show "New" badge on course card
                    </p>
                  </div>
                </div>

                {/* Hot Deal */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="hotDeal"
                    checked={isHotDeal}
                    onCheckedChange={setIsHotDeal}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="hotDeal"
                      className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                    >
                      <Flame className="h-4 w-4 text-danger-600" />
                      Hot Deal
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show "🔥 Hot Deal" badge (limited time)
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview of active tags */}
              {(isFeatured || isMostPopular || isNew || isHotDeal) && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Active Tags Preview:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {isFeatured && (
                      <Badge className="bg-primary-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {isMostPopular && (
                      <Badge className="bg-accent-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    {isNew && (
                      <Badge className="bg-secondary-600">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                    {isHotDeal && (
                      <Badge className="bg-danger-600">
                        <Flame className="h-3 w-3 mr-1" />
                        Hot Deal
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Uploads */}
          <Card className="animate-fade-in-up animation-delay-200">
            <CardHeader>
              <CardTitle>Media & Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thumbnail */}
              <div>
                <Label>Course Thumbnail *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
                  {thumbnail ? (
                    <div className="space-y-3">
                      <img
                        src={thumbnail.preview}
                        alt="Thumbnail"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent-600" />
                        <span>{thumbnail.file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(thumbnail.file.size / 1024).toFixed(0)} KB
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setThumbnail(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove & Upload New
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 2MB (Recommended: 1280x720px)
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Preview Video */}
              <div>
                <Label>Preview Video (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
                  {previewVideo ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Video className="h-5 w-5 text-primary-600" />
                          <p className="text-sm font-medium">
                            {previewVideo.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">
                            {(previewVideo.file.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </Badge>
                          <CheckCircle className="h-4 w-4 text-accent-600" />
                          <span>Ready to upload</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewVideo(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove & Upload New
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handlePreviewVideoUpload}
                      />
                      <Video className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Click to upload preview video
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP4, MOV up to 50MB (2-5 minutes recommended)
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Certificate Template */}
              <div>
                <Label>Certificate Template (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
                  {certificate ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                        {/* Show preview if it's an image */}
                        {certificate.file.type.startsWith("image/") && (
                          <img
                            src={certificate.base64}
                            alt="Certificate Preview"
                            className="w-full max-h-48 object-contain rounded mb-3"
                          />
                        )}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-accent-600" />
                          <p className="text-sm font-medium">
                            {certificate.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">
                            {(certificate.file.size / 1024).toFixed(0)} KB
                          </Badge>
                          <Badge variant="outline">
                            {certificate.file.type.split("/")[1].toUpperCase()}
                          </Badge>
                          <CheckCircle className="h-4 w-4 text-accent-600" />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCertificate(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove & Upload New
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleCertificateUpload}
                      />
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Click to upload certificate template
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, PDF up to 5MB • Students' names will be added
                        automatically
                      </p>
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Modules & Lessons */}
          <Card className="animate-fade-in-up animation-delay-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Content (Modules & Lessons)</CardTitle>
              <Button type="button" size="sm" onClick={addModule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {modules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    No modules added yet
                  </p>
                  <Button type="button" onClick={addModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Module
                  </Button>
                </div>
              ) : (
                modules.map((module, moduleIndex) => (
                  <Card key={module.id} className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <Badge>Module {moduleIndex + 1}</Badge>
                            <Input
                              placeholder="Module title (e.g., Introduction to AI)"
                              value={module.title}
                              onChange={(e) =>
                                updateModuleTitle(module.id, e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeModule(module.id)}
                            >
                              <Trash2 className="h-4 w-4 text-danger-600" />
                            </Button>
                          </div>

                          {/* Lessons */}
                          <div className="ml-6 space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <span className="text-xs font-medium text-muted-foreground w-16">
                                    Lesson {lessonIndex + 1}
                                  </span>
                                  <Input
                                    placeholder="Lesson title"
                                    value={lesson.title}
                                    onChange={(e) =>
                                      updateLessonTitle(
                                        module.id,
                                        lesson.id,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1"
                                    size="sm"
                                  />

                                  {/* ✅ Video Upload Button */}
                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handleLessonVideoUpload(
                                          module.id,
                                          lesson.id,
                                          e.target.files[0]
                                        )
                                      }
                                    />
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      asChild
                                    >
                                      <span className="flex items-center gap-2">
                                        {lesson.videoUrl ? (
                                          <>
                                            <CheckCircle className="h-4 w-4 text-accent-600" />
                                            <span className="max-w-[100px] truncate">
                                              {lesson.videoName || "Video"}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="h-4 w-4" />
                                            Upload
                                          </>
                                        )}
                                      </span>
                                    </Button>
                                  </label>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeLesson(module.id, lesson.id)
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* ✅ Show video details when uploaded */}
                                {lesson.videoUrl && (
                                  <div className="ml-20 p-2 bg-accent-50 dark:bg-accent-900/20 rounded border border-accent-200 dark:border-accent-800">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4 text-accent-600" />
                                        <span className="text-sm font-medium">
                                          {lesson.videoName}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {(
                                            lesson.videoUrl.length /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                          MB
                                        </Badge>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setModules(
                                            modules.map((m) =>
                                              m.id === module.id
                                                ? {
                                                    ...m,
                                                    lessons: m.lessons.map(
                                                      (l) =>
                                                        l.id === lesson.id
                                                          ? {
                                                              ...l,
                                                              videoUrl: "",
                                                              videoName: "",
                                                            }
                                                          : l
                                                    ),
                                                  }
                                                : m
                                            )
                                          );
                                        }}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Remove Video
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addLesson(module.id)}
                              className="ml-20"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Requirements & What You'll Learn */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Requirements */}
            <Card className="animate-fade-in-up animation-delay-400">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Requirements</CardTitle>
                <Button type="button" size="sm" onClick={addRequirement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="e.g., Basic computer skills"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      size="sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="animate-fade-in-up animation-delay-500">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>What You'll Learn</CardTitle>
                <Button type="button" size="sm" onClick={addLearningPoint}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {learningPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="e.g., Understand AI concepts"
                      value={point}
                      onChange={(e) =>
                        updateLearningPoint(index, e.target.value)
                      }
                      size="sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLearningPoint(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 animate-fade-in-up animation-delay-600">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
      `}</style>
    </AdminLayout>
  );
};

export default UploadVideo;
