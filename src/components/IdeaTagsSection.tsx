import { TagList } from "@/components/ui/tag";
import { Tag } from "@/contexts/TaggingContext";
import { useTagging } from "@/hooks/useTagging";
import { useState, useMemo } from "react";

interface IdeaTagsSectionProps {
  ideaText: string;
  className?: string;
}

  export function IdeaTagsSection({ ideaText, className = "" }: IdeaTagsSectionProps) {
  const { taggedIdeas, addTagToIdea, removeTagFromIdea } = useTagging();
  const ideaTags = taggedIdeas.find((i) => i.ideaText === ideaText)?.tags || [];
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

  const handleAddTag = (tagValue?: string) => {
    const tagText = (tagValue ?? newTagText).trim();
    if (
      tagText &&
      ideaTags.length < 5 &&
      !ideaTags.some((t) => t.text === tagText)
    ) {
      addTagToIdea(ideaText, {
        text: tagText,
      });
      setNewTagText("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm ${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#2563eb" }}></div>
          <h3 className="text-lg font-bold text-gray-900">Tags</h3>
        </div>
        <p className="text-sm text-gray-600">
          Add up to 5 tags to describe this idea. Tags help categorize and filter initiatives.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {ideaTags.map((tag, idx) => (
          <span
            key={`${tag.text}-${idx}`}
            className="inline-flex items-center rounded-full border font-medium text-sm px-2.5 py-1.5 bg-blue-600 text-white border-blue-700 mr-1 mb-1"
          >
            {tag.text}
            <button
              className="ml-2 text-xs bg-white text-blue-600 rounded-full px-1 py-0.5 border border-blue-300 hover:bg-blue-100"
              onClick={() => removeTagFromIdea(ideaText, tag.text)}
              aria-label={`Remove tag ${tag.text}`}
            >
              ×
            </button>
          </span>
        ))}
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
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-10 bg-white border border-gray-200 rounded shadow-md mt-1 w-full max-h-40 overflow-auto">
                {filteredSuggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="px-2 py-1 text-sm cursor-pointer hover:bg-blue-50"
                    onMouseDown={() => handleAddTag(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
            onClick={() => handleAddTag()}
            disabled={!newTagText.trim() || ideaTags.length >= 5}
          >
            Add Tag
          </button>
        </div>
      )}
    </div>
  );
}
