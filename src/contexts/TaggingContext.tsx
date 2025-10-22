import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";


export interface Tag {
  text: string;
}

export interface TaggedIdea {
  ideaText: string;
  tags: Tag[];
}

export interface TaggingContextType {
  taggedIdeas: TaggedIdea[];
  addTagToIdea: (ideaText: string, tag: Tag) => Promise<void>;
  removeTagFromIdea: (ideaText: string, tagText: string) => Promise<void>;
  getTagsForIdea: (ideaText: string) => Promise<Tag[]>;
  updateTagOnIdea: (ideaText: string, oldTagText: string, newTagText: string) => Promise<void>;
  isLoading: boolean;
}

const TaggingContext = createContext<TaggingContextType | undefined>(undefined);

export function TaggingProvider({ children }: { children: ReactNode }) {
  // Keep tagged ideas in memory but backed by server Postgres
  const [taggedIdeas, setTaggedIdeas] = useState<TaggedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all tags from server on mount to restore persisted tags
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/tags/all");
        if (!res.ok) throw new Error("Failed to load all tags");
        const data = await res.json();
        const tagsByIdea: Record<string, Array<{ text: string }>> = data.tagsByIdea || {};
        if (!mounted) return;
        const arr: TaggedIdea[] = Object.entries(tagsByIdea).map(([ideaText, tags]) => ({ ideaText, tags: tags.map((t) => ({ text: t.text })) }));
        setTaggedIdeas(arr);
      } catch (err) {
        console.warn("Failed to load persisted tags:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  const addTagToIdea = useCallback((ideaText: string, tag: Tag) => {
    // call server to persist
    return fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaText, tagText: tag.text }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to add tag");
      // Update local cache optimistically
      setTaggedIdeas((prev) => {
        const ideaIdx = prev.findIndex((i) => i.ideaText === ideaText);
        if (ideaIdx !== -1) {
          const idea = prev[ideaIdx];
          if (idea.tags.length >= 5) return prev;
          if (idea.tags.some((t) => t.text === tag.text)) return prev;
          const updatedIdea = { ...idea, tags: [...idea.tags, tag] };
          return [
            ...prev.slice(0, ideaIdx),
            updatedIdea,
            ...prev.slice(ideaIdx + 1),
          ];
        } else {
          return [...prev, { ideaText, tags: [tag] }];
        }
      });
    });
  }, []);

  const getTagsForIdea = useCallback(async (ideaText: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tags?ideaText=${encodeURIComponent(ideaText)}`);
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      const tags: Tag[] = data.tags || [];
      // update local cache
      setTaggedIdeas((prev) => {
        const ideaIdx = prev.findIndex((i) => i.ideaText === ideaText);
        if (ideaIdx !== -1) {
          const updated = { ...prev[ideaIdx], tags };
          return [...prev.slice(0, ideaIdx), updated, ...prev.slice(ideaIdx + 1)];
        }
        return [...prev, { ideaText, tags }];
      });
      return tags;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTagOnIdea = useCallback(
    async (ideaText: string, oldTagText: string, newTagText: string) => {
      if (oldTagText === newTagText) return;
      const res = await fetch("/api/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaText, oldTagText, newTagText }),
      });
      if (!res.ok) throw new Error("Failed to update tag");
      // update local cache
      setTaggedIdeas((prev) => {
        const ideaIdx = prev.findIndex((i) => i.ideaText === ideaText);
        if (ideaIdx === -1) return prev;
        const idea = prev[ideaIdx];
        if (idea.tags.some((t) => t.text === newTagText)) return prev;
        const updatedIdea = {
          ...idea,
          tags: idea.tags.map((t) => (t.text === oldTagText ? { text: newTagText } : t)),
        };
        return [
          ...prev.slice(0, ideaIdx),
          updatedIdea,
          ...prev.slice(ideaIdx + 1),
        ];
      });
    },
    []
  );

  const removeTagFromIdea = useCallback((ideaText: string, tagText: string) => {
    return fetch("/api/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaText, tagText }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to delete tag");
      setTaggedIdeas((prev) => {
        const ideaIdx = prev.findIndex((i) => i.ideaText === ideaText);
        if (ideaIdx !== -1) {
          const idea = prev[ideaIdx];
          const updatedIdea = { ...idea, tags: idea.tags.filter((t) => t.text !== tagText) };
          return [...prev.slice(0, ideaIdx), updatedIdea, ...prev.slice(ideaIdx + 1)];
        }
        return prev;
      });
    });
  }, []);

  const value: TaggingContextType = useMemo(
    () => ({
      taggedIdeas,
      addTagToIdea,
      removeTagFromIdea,
      getTagsForIdea,
      updateTagOnIdea,
      isLoading,
    }),
    [taggedIdeas, addTagToIdea, removeTagFromIdea, getTagsForIdea, updateTagOnIdea, isLoading]
  );

  return (
    <TaggingContext.Provider value={value}>{children}</TaggingContext.Provider>
  );
}

export default TaggingContext;
