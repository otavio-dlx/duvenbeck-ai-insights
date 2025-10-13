import { Tag as TagType } from "@/contexts/TaggingContext";
import { cn } from "@/lib/utils";

interface TagProps {
  tag: TagType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Single color style for all tags - red background with white text
const TAG_STYLE = {
  bg: "#dc2626", // Red background (red-600)
  text: "#ffffff", // White text
  border: "#b91c1c", // Darker red border (red-700)
};

const SIZE_CLASSES = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-2.5 py-1.5",
  lg: "text-base px-3 py-2",
};

export function TagComponent({
  tag,
  size = "sm",
  className,
}: Readonly<TagProps>) {
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        sizeClasses,
        className
      )}
      style={{
        backgroundColor: TAG_STYLE.bg,
        color: TAG_STYLE.text,
        borderColor: TAG_STYLE.border,
      }}
      title={
        `Category: ${tag.category}` +
        (tag.confidence ? ` (${Math.round(tag.confidence * 100)}%)` : "")
      }
    >
      {tag.text}
    </span>
  );
}

interface TagListProps {
  tags: TagType[];
  size?: "sm" | "md" | "lg";
  className?: string;
  showAll?: boolean;
  maxTags?: number;
}

export function TagList({
  tags,
  size = "sm",
  className,
  showAll = false,
  maxTags = 3,
}: Readonly<TagListProps>) {
  const displayTags = showAll ? tags : tags.slice(0, maxTags);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayTags.map((tag, index) => (
        <TagComponent
          key={`${tag.text}-${tag.category}-${index}`}
          tag={tag}
          size={size}
        />
      ))}
      {!showAll && tags.length > maxTags && (
        <span
          className={cn(
            "inline-flex items-center rounded-full border font-medium",
            SIZE_CLASSES[size]
          )}
          style={{
            backgroundColor: "#f3f4f6", // gray-100
            color: "#4b5563", // gray-600
            borderColor: "#e5e7eb", // gray-200
          }}
        >
          +{tags.length - maxTags}
        </span>
      )}
    </div>
  );
}
