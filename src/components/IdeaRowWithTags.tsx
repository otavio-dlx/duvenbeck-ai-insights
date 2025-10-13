import { TagList } from "@/components/ui/tag";
import { Tag } from "@/contexts/TaggingContext";
import { LocalizableString } from "@/data/types";
import { useTagging } from "@/hooks/useTagging";
import { getLocalizedString } from "@/lib/data";
import { useEffect, useState } from "react";

interface IdeaRowWithTagsProps {
  source: string;
  idee?: LocalizableString;
  finalPrio?: string | number;
  prioritaet?: string;
  sourceDisplay: string;
  onIdeaClick: (source: string, idee: string) => void;
}

export function IdeaRowWithTags({
  source,
  idee,
  finalPrio,
  prioritaet,
  sourceDisplay,
  onIdeaClick,
}: Readonly<IdeaRowWithTagsProps>) {
  const { getTagsForIdea, isLoading } = useTagging();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  const ideaText = idee ? getLocalizedString(idee) : "";
  const ideaKey = `${source}-${ideaText}`;

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

  const handleClick = () => {
    if (idee) {
      onIdeaClick(
        source,
        typeof idee === "string" ? idee : JSON.stringify(idee)
      );
    }
  };

  return (
    <tr
      key={ideaKey}
      className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <td className="p-2">{sourceDisplay}</td>
      <td className="p-2">
        <div className="space-y-2">
          <div>{ideaText}</div>
          {/* Tags section */}
          <div className="min-h-[24px]">
            {loadingTags || isLoading ? (
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 rounded-full h-6 w-16"
                  />
                ))}
              </div>
            ) : (
              <TagList tags={tags} size="sm" maxTags={3} />
            )}
          </div>
        </div>
      </td>
      <td className="p-2">{String(finalPrio)}</td>
      <td className="p-2">{prioritaet}</td>
    </tr>
  );
}
