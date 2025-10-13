import { useContext } from "react";
import TaggingContext, {
  type TaggingContextType,
} from "../contexts/TaggingContext";

export function useTagging(): TaggingContextType {
  const context = useContext(TaggingContext);
  if (!context) {
    throw new Error("useTagging must be used within a TaggingProvider");
  }
  return context;
}
