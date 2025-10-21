import { TagList } from "@/components/ui/tag";
import { Tag } from "@/contexts/TaggingContext";
import { useTagging } from "@/hooks/useTagging";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

interface IdeaTagsSectionProps {
  ideaText: string;
  className?: string;
  variant?: "default" | "modalRed";
}

  export function IdeaTagsSection({ ideaText, className = "", variant = "default" }: IdeaTagsSectionProps) {
  const { taggedIdeas, addTagToIdea, removeTagFromIdea } = useTagging();
  const ideaTags = taggedIdeas.find((i) => i.ideaText === ideaText)?.tags || [];
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTagText, setNewTagText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Collect all unique tags used in any idea (except current idea)
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    taggedIdeas.forEach((idea) => {
      if (idea.ideaText !== ideaText) {
        idea.tags.forEach((tag) => tagsSet.add(tag.text));
      }
    });
    return Array.from(tagsSet);
  }, [taggedIdeas, ideaText]);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!newTagText.trim()) return [];
    return allTags.filter((tag) =>
      tag.toLowerCase().startsWith(newTagText.trim().toLowerCase())
    );
  }, [allTags, newTagText]);

  const handleAddTag = async (tagValue?: string) => {
    const tagText = (tagValue ?? newTagText).trim();
    if (!tagText) return;
    if (ideaTags.some((t) => t.text === tagText)) {
      toast({ title: "Tag exists", description: `The tag \"${tagText}\" already exists.` });
      return;
    }
    if (ideaTags.length >= 5) {
      toast({ title: "Max tags reached", description: "An idea can have at most 5 tags." });
      return;
    }

    setIsSubmitting(true);
    try {
      await addTagToIdea(ideaText, { text: tagText });
      setNewTagText("");
      setShowSuggestions(false);
    } catch (err: any) {
      // server responses: 409 -> duplicate, 400 -> max tags
      if (err?.status === 409 || err?.message?.includes("duplicate") ) {
        toast({ title: "Tag exists", description: `The tag \"${tagText}\" already exists.` });
      } else if (err?.status === 400 || err?.message?.includes("Max 5")) {
        toast({ title: "Max tags reached", description: "An idea can have at most 5 tags." });
      } else {
        toast({ title: "Failed to add tag", description: "Please try again." });
      }
      console.error("Failed to add tag:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm ${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900">Tags</h3>
        </div>
        <p className="text-sm text-gray-600">
          Add up to 5 tags to describe this idea. Tags help categorize and filter initiatives.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {ideaTags.map((tag, idx) => {
          const tagClass =
            variant === "modalRed"
              ? "inline-flex items-center rounded-full border font-medium text-sm px-2.5 py-1.5 bg-red-600 text-white border-red-700 mr-1 mb-1"
              : "inline-flex items-center rounded-full border font-medium text-sm px-2.5 py-1.5 bg-blue-600 text-white border-blue-700 mr-1 mb-1";

          const removeBtnClass =
            "ml-2 text-xs text-white px-1 py-0 hover:opacity-90 cursor-pointer";

          return (
            <span key={`${tag.text}-${idx}`} className={tagClass}>
              {tag.text}
              <button
                className={removeBtnClass}
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsSubmitting(true);
                  try {
                    await removeTagFromIdea(ideaText, tag.text);
                  } catch (err) {
                    toast({ title: "Failed to remove tag", description: "Please try again." });
                    console.error("Failed to remove tag:", err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                aria-label={`Remove tag ${tag.text}`}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  className="inline-block"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          );
        })}
      </div>
      {ideaTags.length < 5 && (
        <div className="mt-4 flex gap-2 items-center">
          <div className="relative w-48">
            <input
              type="text"
              className="border rounded px-2 py-1 text-sm w-full"
              placeholder="Add a tag..."
              value={newTagText}
              onChange={(e) => {
                setNewTagText(e.target.value);
                setShowSuggestions(true);
              }}
              maxLength={32}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              disabled={isSubmitting}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-10 bg-white border border-gray-200 rounded shadow-md mt-1 w-full max-h-40 overflow-auto">
                {filteredSuggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className={`px-2 py-1 text-sm cursor-pointer ${
                      variant === "modalRed" ? "hover:bg-red-50" : "hover:bg-blue-50"
                    }`}
                    onMouseDown={() => handleAddTag(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className={
              variant === "modalRed"
                ? "bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                : "bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
            }
            onClick={() => handleAddTag()}
            disabled={!newTagText.trim() || ideaTags.length >= 5 || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Tag"}
          </button>
        </div>
      )}
    </div>
  );
}
