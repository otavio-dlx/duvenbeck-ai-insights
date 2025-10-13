import { TagList } from "@/components/ui/tag";
import { Tag } from "@/contexts/TaggingContext";
import { useTagging } from "@/hooks/useTagging";
import { useEffect, useState } from "react";

interface IdeaTagsSectionProps {
  ideaText: string;
  className?: string;
}

export function IdeaTagsSection({
  ideaText,
  className = "",
}: Readonly<IdeaTagsSectionProps>) {
  const { getTagsForIdea, isLoading } = useTagging();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    if (ideaText.trim()) {
      setLoadingTags(true);
      getTagsForIdea(ideaText)
        .then((fetchedTags) => {
          setTags(fetchedTags);
        })
        .catch(async (error) => {
          console.error("Failed to fetch tags for idea:", error);
          // Generate smart fallback tags based on idea content
          const { generateFallbackTags } = await import("@/lib/fallbackTags");
          setTags(generateFallbackTags(ideaText));
        })
        .finally(() => {
          setLoadingTags(false);
        });
    }
  }, [ideaText, getTagsForIdea]);

  if (loadingTags || isLoading) {
    return (
      <div
        className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm ${className}`}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#dc2626" }}
            ></div>
            <h3 className="text-lg font-bold text-gray-900">
              AI-Generated Tags
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Automatically generated insights about this idea...
          </p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-full h-8 w-20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div
        className={`bg-gray-50 rounded-lg p-6 border border-gray-200 ${className}`}
      >
        <div className="text-center text-gray-500">
          <p>No tags available for this idea.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#dc2626" }}
          ></div>
          <h3 className="text-lg font-bold text-gray-900">AI-Generated Tags</h3>
        </div>
        <p className="text-sm text-gray-600">
          Automatically generated insights about this idea using machine
          learning analysis.
        </p>
      </div>

      <TagList tags={tags} size="md" showAll />
    </div>
  );
}
