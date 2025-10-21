import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";


export interface Tag {
  text: string;
}

export interface TaggedIdea {
  ideaText: string;
  tags: Tag[];
}

export interface TaggingContextType {
  taggedIdeas: TaggedIdea[];
  addTagToIdea: (ideaText: string, tag: Tag) => void;
  removeTagFromIdea: (ideaText: string, tagText: string) => void;
}

const TaggingContext = createContext<TaggingContextType | undefined>(undefined);

export function TaggingProvider({ children }: { children: ReactNode }) {
  // Load from localStorage on mount
  const [taggedIdeas, setTaggedIdeas] = useState<TaggedIdea[]>(() => {
    try {
      const stored = localStorage.getItem("taggedIdeas");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever taggedIdeas changes
  useEffect(() => {
    try {
      localStorage.setItem("taggedIdeas", JSON.stringify(taggedIdeas));
    } catch {}
  }, [taggedIdeas]);

  const addTagToIdea = useCallback((ideaText: string, tag: Tag) => {
    setTaggedIdeas((prev) => {
      const ideaIdx = prev.findIndex((i) => i.ideaText === ideaText);
      if (ideaIdx !== -1) {
        const idea = prev[ideaIdx];
        // Enforce max 5 tags
        if (idea.tags.length >= 5) return prev;
        // Prevent duplicate tags
        if (idea.tags.some((t) => t.text === tag.text)) return prev;
        const updatedIdea = {
          ...idea,
          tags: [...idea.tags, tag],
        };
        return [
          ...prev.slice(0, ideaIdx),
          updatedIdea,
          ...prev.slice(ideaIdx + 1),
        ];
      } else {
        return [...prev, { ideaText, tags: [tag] }];
      }
    });
  }, []);

  const removeTagFromIdea = useCallback((ideaText: string, tagText: string) => {
    setTaggedIdeas((prev) => {
      const ideaIdx = prev.findIndex((i) => i.ideaText === ideaText);
      if (ideaIdx !== -1) {
        const idea = prev[ideaIdx];
        const updatedIdea = {
          ...idea,
          tags: idea.tags.filter((t) => t.text !== tagText),
        };
        return [
          ...prev.slice(0, ideaIdx),
          updatedIdea,
          ...prev.slice(ideaIdx + 1),
        ];
      }
      return prev;
    });
  }, []);

  const value: TaggingContextType = useMemo(
    () => ({
      taggedIdeas,
      addTagToIdea,
      removeTagFromIdea,
    }),
    [taggedIdeas, addTagToIdea, removeTagFromIdea]
  );

  return (
    <TaggingContext.Provider value={value}>{children}</TaggingContext.Provider>
  );
}

export default TaggingContext;
